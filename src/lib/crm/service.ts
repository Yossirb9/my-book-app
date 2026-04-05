import JSZip from 'jszip'
import Stripe from 'stripe'
import { User } from '@supabase/supabase-js'
import { BOOK_PRICES, JOURNAL_PRICE, LENGTH_PAGES, OrderDraftInput } from '@/types'
import { generateMarketingContent } from '@/lib/gemini/generateMarketingContent'
import { generatePageImage } from '@/lib/gemini/generateImage'
import { sendOperationalEmail } from '@/lib/notifications'
import { createAdminClient } from '@/lib/supabase/server'
import { Json, Tables } from '@/lib/supabase/database.types'
import { sanitizeFilenamePart } from '@/lib/crm/utils'

type CustomerProfile = Tables<'customer_profiles'>
type Order = Tables<'orders'>
type Promotion = Tables<'promotions'>

function getObjectValue(record: Json | null | undefined, key: string) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return null
  }

  return key in record ? record[key] : null
}

function getJsonString(record: Json | null | undefined, key: string) {
  const value = getObjectValue(record, key)
  return typeof value === 'string' ? value : null
}

function getBookTemplate(record: { params?: Json | null } | null | undefined) {
  return getJsonString(record?.params, 'template')
}

function getBookLength(record: { params?: Json | null } | null | undefined) {
  return getJsonString(record?.params, 'length')
}

function getOrderItemMetadataValue(orderItem: { metadata?: Json | null } | null | undefined, key: string) {
  return getJsonString(orderItem?.metadata, key)
}

export async function ensureCustomerProfileForUser(
  user: User,
  context?: {
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmTerm?: string | null
    utmContent?: string | null
    phone?: string | null
  }
) {
  const adminSupabase = await createAdminClient()
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(' ') ||
    null

  const existing = await adminSupabase
    .from('customer_profiles')
    .select('*')
    .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
    .maybeSingle()

  const payload = {
    auth_user_id: user.id,
    email: user.email!,
    full_name: fullName,
    phone: context?.phone || existing.data?.phone || null,
    registered_at: existing.data?.registered_at || user.created_at || new Date().toISOString(),
    utm_source: context?.utmSource || existing.data?.utm_source || null,
    utm_medium: context?.utmMedium || existing.data?.utm_medium || null,
    utm_campaign: context?.utmCampaign || existing.data?.utm_campaign || null,
    utm_term: context?.utmTerm || existing.data?.utm_term || null,
    utm_content: context?.utmContent || existing.data?.utm_content || null,
  }

  const profile = await adminSupabase
    .from('customer_profiles')
    .upsert(payload, { onConflict: 'email' })
    .select('*')
    .single()

  if (!profile.data) {
    throw new Error('Failed to upsert customer profile')
  }

  if (!existing.data) {
    await recordActivity({
      customerId: profile.data.id,
      actorType: 'system',
      eventType: 'customer.profile_created',
      payload: { email: user.email },
    })
  }

  return profile.data
}

export async function syncCustomerLifecycle(customerId: string) {
  const adminSupabase = await createAdminClient()
  const { data: orders } = await adminSupabase
    .from('orders')
    .select('id')
    .eq('customer_id', customerId)
    .in('status', ['paid', 'fulfilled', 'refunded'])

  const count = orders?.length || 0
  const lifecycle = count <= 0 ? 'lead' : count === 1 ? 'paying' : 'returning'

  await adminSupabase
    .from('customer_profiles')
    .update({ lifecycle_status: lifecycle })
    .eq('id', customerId)

  return lifecycle
}

export async function recordActivity(input: {
  customerId?: string | null
  orderId?: string | null
  bookId?: string | null
  ticketId?: string | null
  actorStaffUserId?: string | null
  actorType?: 'system' | 'customer' | 'staff'
  eventType: string
  payload?: Json
}) {
  const adminSupabase = await createAdminClient()
  await adminSupabase.from('activity_events').insert({
    customer_id: input.customerId || null,
    order_id: input.orderId || null,
    book_id: input.bookId || null,
    ticket_id: input.ticketId || null,
    actor_staff_user_id: input.actorStaffUserId || null,
    actor_type: input.actorType || 'system',
    event_type: input.eventType,
    payload: input.payload || {},
  })
}

export function getBookPriceCents(params: { template: string; length?: 'short' | 'medium' | 'long' }) {
  if (params.template === 'emotional_journal') {
    return JOURNAL_PRICE * 100
  }

  const length = params.length || 'short'
  return BOOK_PRICES[length] * 100
}

async function resolvePromotionCode(code: string | undefined, customerId: string) {
  if (!code) return null

  const adminSupabase = await createAdminClient()
  const promotionResult = await adminSupabase
    .from('promotions')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .eq('is_active', true)
    .maybeSingle()

  const promotion = promotionResult.data
  if (!promotion) return null

  if (promotion.assigned_customer_id && promotion.assigned_customer_id !== customerId) {
    return null
  }

  if (promotion.expires_at && new Date(promotion.expires_at) < new Date()) {
    return null
  }

  if (promotion.usage_limit && promotion.used_count >= promotion.usage_limit) {
    return null
  }

  return promotion
}

function calculateDiscount(subtotal: number, promotion: Promotion | null) {
  if (!promotion) return 0
  if (promotion.kind === 'percentage') {
    return Math.min(subtotal, Math.round((subtotal * promotion.amount) / 100))
  }
  return Math.min(subtotal, promotion.amount)
}

export async function createOrderForBook(input: {
  user: User
  book: Tables<'books'>
  orderDraft: OrderDraftInput
  params: { template: string; length?: 'short' | 'medium' | 'long' }
}) {
  const adminSupabase = await createAdminClient()
  const customer = await ensureCustomerProfileForUser(input.user, {
    phone: input.orderDraft.shippingAddress?.phone || null,
  })

  const subtotal = getBookPriceCents(input.params)
  const promotion = await resolvePromotionCode(input.orderDraft.promotionCode, customer.id)
  const discount = calculateDiscount(subtotal, promotion)
  const total = Math.max(0, subtotal - discount)
  const orderType = input.orderDraft.deliveryOption === 'physical' ? 'physical' : 'digital'

  const { data: order, error: orderError } = await adminSupabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      source: 'manual',
      status: 'paid',
      order_type: orderType,
      currency: 'ILS',
      subtotal_amount: subtotal,
      discount_amount: discount,
      total_amount: total,
      promotion_id: promotion?.id || null,
      stripe_payment_intent_id: input.book.stripe_payment_intent_id,
      paid_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (orderError || !order) {
    throw new Error('Failed to create order')
  }

  await adminSupabase.from('order_items').insert({
    order_id: order.id,
    book_id: input.book.id,
    product_type: 'book',
    product_title: input.book.title,
    quantity: 1,
    unit_amount: subtotal,
    total_amount: total,
    metadata: {
      template: input.params.template,
      length: input.params.length || null,
    },
  })

  await adminSupabase.from('payment_transactions').insert({
    order_id: order.id,
    customer_id: customer.id,
    provider: 'manual',
    kind: 'manual',
    status: 'succeeded',
    amount: total,
    currency: 'ILS',
    provider_transaction_id: input.book.id,
    payload: {
      source: 'book_create_flow',
      promotionCode: promotion?.code || null,
    },
  })

  if (promotion) {
    await adminSupabase.from('promotion_redemptions').insert({
      promotion_id: promotion.id,
      customer_id: customer.id,
      order_id: order.id,
      discount_amount: discount,
    })

    await adminSupabase
      .from('promotions')
      .update({ used_count: promotion.used_count + 1 })
      .eq('id', promotion.id)
  }

  if (input.orderDraft.deliveryOption === 'physical' && input.orderDraft.shippingAddress) {
    const address = input.orderDraft.shippingAddress

    await adminSupabase.from('shipping_addresses').insert({
      order_id: order.id,
      customer_id: customer.id,
      recipient_name: address.recipientName,
      phone: address.phone,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2 || null,
      city: address.city,
      state: address.state || null,
      postal_code: address.postalCode || null,
      country: address.country || 'IL',
    })

    await adminSupabase.from('fulfillment_orders').insert({
      order_id: order.id,
      book_id: input.book.id,
      status: 'pending_print',
      print_binding: 'soft',
      print_page_count:
        input.params.template === 'emotional_journal'
          ? 30
          : LENGTH_PAGES[input.params.length || 'short'].max,
    })
  }

  await syncCustomerLifecycle(customer.id)

  await recordActivity({
    customerId: customer.id,
    orderId: order.id,
    bookId: input.book.id,
    actorType: 'customer',
    eventType: 'order.created',
    payload: {
      deliveryOption: input.orderDraft.deliveryOption,
      totalAmount: total,
      promotionCode: promotion?.code || null,
    },
  })

  return { customer, order }
}

export async function getDashboardData() {
  const adminSupabase = await createAdminClient()
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const failuresSince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const [{ data: orders }, { count: pendingPrint }, { count: openTickets }, { count: failedBooks }] =
    await Promise.all([
      adminSupabase.from('orders').select('*').gte('created_at', monthStart.toISOString()),
      adminSupabase
        .from('fulfillment_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_print'),
      adminSupabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'resolved'),
      adminSupabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed')
        .gte('updated_at', failuresSince),
    ])

  const paidOrders = (orders || []).filter((order) =>
    ['paid', 'fulfilled', 'refunded'].includes(order.status)
  )
  const revenue = paidOrders.reduce((sum, order) => sum + order.total_amount, 0)
  const bookCount = paidOrders.length
  const digitalCount = paidOrders.filter((order) => order.order_type === 'digital').length
  const physicalCount = paidOrders.filter((order) => order.order_type !== 'digital').length
  const aov = bookCount ? Math.round(revenue / bookCount) : 0

  return {
    revenue,
    bookCount,
    digitalCount,
    physicalCount,
    aov,
    pendingPrint: pendingPrint || 0,
    openTickets: openTickets || 0,
    failedBooks: failedBooks || 0,
  }
}

export async function getInsightsData() {
  const adminSupabase = await createAdminClient()
  const [
    { data: books },
    { data: orders },
    { data: orderItems },
    { data: customers },
    { count: openTickets },
  ] = await Promise.all([
    adminSupabase
      .from('books')
      .select('id, user_id, title, status, created_at, params')
      .order('created_at', { ascending: false }),
    adminSupabase.from('orders').select('id, customer_id, order_type, total_amount, status, created_at'),
    adminSupabase.from('order_items').select('order_id, book_id, total_amount, metadata'),
    adminSupabase.from('customer_profiles').select('id, auth_user_id, full_name, email, lifecycle_status'),
    adminSupabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'resolved'),
  ])

  const orderById = new Map((orders || []).map((order) => [order.id, order]))
  const customerById = new Map((customers || []).map((customer) => [customer.id, customer]))
  const customerByAuthUserId = new Map(
    (customers || [])
      .filter((customer) => customer.auth_user_id)
      .map((customer) => [customer.auth_user_id as string, customer])
  )
  const orderItemByBookId = new Map(
    (orderItems || [])
      .filter((item) => item.book_id)
      .map((item) => [item.book_id as string, item])
  )

  const bookRows = (books || []).map((book) => {
    const orderItem = orderItemByBookId.get(book.id) || null
    const order = orderItem ? orderById.get(orderItem.order_id) || null : null
    const customer =
      (order?.customer_id ? customerById.get(order.customer_id) : null) ||
      (book.user_id ? customerByAuthUserId.get(book.user_id) : null) ||
      null
    const template = getOrderItemMetadataValue(orderItem, 'template') || getBookTemplate(book)
    const length = getOrderItemMetadataValue(orderItem, 'length') || getBookLength(book)

    return {
      id: book.id,
      title: book.title,
      status: book.status,
      created_at: book.created_at,
      template,
      length,
      amount: orderItem?.total_amount || order?.total_amount || 0,
      orderType: order?.order_type || 'digital',
      customerName: customer?.full_name || customer?.email || 'לקוח לא מזוהה',
      customerEmail: customer?.email || '',
    }
  })

  const totalBooks = bookRows.length
  const readyBooks = bookRows.filter((book) => book.status === 'ready').length
  const failedBooks = bookRows.filter((book) => book.status === 'failed').length
  const digitalBooks = bookRows.filter((book) => book.orderType === 'digital').length
  const physicalBooks = bookRows.filter((book) => book.orderType === 'physical').length

  const templatesMap = new Map<string, { template: string; count: number; revenue: number }>()
  const lengthMap = new Map<string, number>()
  const statusMap = new Map<string, number>()

  for (const book of bookRows) {
    const templateKey = book.template || 'unknown'
    const currentTemplate = templatesMap.get(templateKey) || {
      template: templateKey,
      count: 0,
      revenue: 0,
    }
    currentTemplate.count += 1
    currentTemplate.revenue += book.amount
    templatesMap.set(templateKey, currentTemplate)

    const lengthKey = book.length || 'unknown'
    lengthMap.set(lengthKey, (lengthMap.get(lengthKey) || 0) + 1)

    const statusKey = book.status || 'draft'
    statusMap.set(statusKey, (statusMap.get(statusKey) || 0) + 1)
  }

  const topTemplates = [...templatesMap.values()]
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count
      }

      return right.revenue - left.revenue
    })
    .slice(0, 6)

  const topTemplate = topTemplates[0] || null
  const returningCustomers = (customers || []).filter((customer) => customer.lifecycle_status === 'returning').length
  const payingCustomers = (customers || []).filter((customer) => customer.lifecycle_status === 'paying').length
  const leads = (customers || []).filter((customer) => customer.lifecycle_status === 'lead').length

  const actionableInsights: string[] = []

  if (topTemplate && totalBooks > 0) {
    const share = Math.round((topTemplate.count / totalBooks) * 100)
    actionableInsights.push(`סוג הספר המוביל אחראי לכ-${share}% מהיצירות במערכת.`)
  }

  if (physicalBooks > 0) {
    actionableInsights.push(`${physicalBooks} ספרים פיזיים דורשים מעקב הדפסה ומשלוח לעומת ${digitalBooks} ספרים דיגיטליים.`)
  }

  if (failedBooks > 0) {
    actionableInsights.push(`יש כרגע ${failedBooks} ספרים שנכשלו ודורשים בדיקת תוכן או AI.`)
  }

  if (returningCustomers > 0) {
    actionableInsights.push(`${returningCustomers} לקוחות כבר חזרו להזמנה נוספת, אינדיקציה טובה לשימור.`)
  }

  return {
    summary: {
      totalBooks,
      readyBooks,
      failedBooks,
      digitalBooks,
      physicalBooks,
      openTickets: openTickets || 0,
      payingCustomers,
      returningCustomers,
      leads,
    },
    topTemplates,
    lengthBreakdown: [...lengthMap.entries()].map(([length, count]) => ({ length, count })),
    statusBreakdown: [...statusMap.entries()].map(([status, count]) => ({ status, count })),
    recentBooks: bookRows.slice(0, 8),
    actionableInsights,
  }
}

export async function listCustomers() {
  const adminSupabase = await createAdminClient()
  const [{ data: customers }, { data: orders }, { data: books }] = await Promise.all([
    adminSupabase.from('customer_profiles').select('*').order('created_at', { ascending: false }),
    adminSupabase.from('orders').select('*'),
    adminSupabase.from('books').select('id, user_id, status, created_at'),
  ])

  return (customers || []).map((customer) => {
    const customerOrders = (orders || []).filter((order) => order.customer_id === customer.id)
    const customerBooks = (books || []).filter((book) => book.user_id === customer.auth_user_id)
    const ltv = customerOrders.reduce((sum, order) => sum + order.total_amount, 0)

    return {
      ...customer,
      ltv,
      orderCount: customerOrders.length,
      bookCount: customerBooks.length,
      lastOrderAt: customerOrders[0]?.created_at || null,
    }
  })
}

export async function getCustomerDetail(customerId: string) {
  const adminSupabase = await createAdminClient()
  const { data: customer } = await adminSupabase
    .from('customer_profiles')
    .select('*')
    .eq('id', customerId)
    .single()

  if (!customer) return null

  const [ordersResult, paymentsResult, notesResult, tagsResult, activitiesResult, booksResult] =
    await Promise.all([
      adminSupabase
        .from('orders')
        .select('*, fulfillment_orders(*), shipping_addresses(*), promotions(code), order_items(*)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false }),
      adminSupabase
        .from('payment_transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false }),
      adminSupabase
        .from('customer_notes')
        .select('*, staff_users(email, role)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false }),
      adminSupabase
        .from('customer_tag_assignments')
        .select('*, customer_tags(*)')
        .eq('customer_id', customerId),
      adminSupabase
        .from('activity_events')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(50),
      customer.auth_user_id
        ? adminSupabase
            .from('books')
            .select('*, characters(*), book_pages(*)')
            .eq('user_id', customer.auth_user_id)
            .order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
    ])

  const orders = ordersResult.data || []
  const ltv = orders.reduce((sum, order) => sum + order.total_amount, 0)

  return {
    customer,
    orders,
    payments: paymentsResult.data || [],
    notes: notesResult.data || [],
    tags: tagsResult.data || [],
    activities: activitiesResult.data || [],
    books: booksResult.data || [],
    ltv,
  }
}

export async function listFulfillmentOrders() {
  const adminSupabase = await createAdminClient()
  const { data: fulfillmentRows } = await adminSupabase
    .from('fulfillment_orders')
    .select('*')
    .order('created_at', { ascending: true })

  const orderIds = (fulfillmentRows || []).map((row) => row.order_id)
  const bookIds = (fulfillmentRows || []).map((row) => row.book_id).filter(Boolean) as string[]

  const [ordersResult, addressesResult, booksResult] = await Promise.all([
    orderIds.length
      ? adminSupabase
          .from('orders')
          .select('*, customer_profiles(*)')
          .in('id', orderIds)
      : Promise.resolve({ data: [] }),
    orderIds.length
      ? adminSupabase.from('shipping_addresses').select('*').in('order_id', orderIds)
      : Promise.resolve({ data: [] }),
    bookIds.length
      ? adminSupabase.from('books').select('*').in('id', bookIds)
      : Promise.resolve({ data: [] }),
  ])

  return (fulfillmentRows || []).map((item) => ({
    ...item,
    order: (ordersResult.data || []).find((order) => order.id === item.order_id) || null,
    shippingAddress:
      (addressesResult.data || []).find((address) => address.order_id === item.order_id) || null,
    book: (booksResult.data || []).find((book) => book.id === item.book_id) || null,
  }))
}

export async function bulkUpdateFulfillmentStatuses(
  fulfillmentIds: string[],
  status: Tables<'fulfillment_orders'>['status'],
  staffUserId?: string
) {
  const adminSupabase = await createAdminClient()
  if (!fulfillmentIds.length) return []

  const { data: rows } = await adminSupabase
    .from('fulfillment_orders')
    .select('*')
    .in('id', fulfillmentIds)

  const now = new Date().toISOString()

  await adminSupabase
    .from('fulfillment_orders')
    .update({
      status,
      sent_to_printer_at: status === 'sent_to_printer' ? now : undefined,
      shipped_at: status === 'shipped' ? now : undefined,
      delivered_at: status === 'delivered' ? now : undefined,
    })
    .in('id', fulfillmentIds)

  for (const row of rows || []) {
    await recordActivity({
      orderId: row.order_id,
      bookId: row.book_id,
      actorStaffUserId: staffUserId,
      actorType: 'staff',
      eventType: 'fulfillment.status_changed',
      payload: { status },
    })
  }

  const orderIds = (rows || []).map((row) => row.order_id)
  if (status === 'sent_to_printer' && orderIds.length) {
    const { data: orders } = await adminSupabase
      .from('orders')
      .select('*, customer_profiles(*)')
      .in('id', orderIds)

    for (const order of orders || []) {
      const customer = order.customer_profiles as CustomerProfile | null
      if (!customer?.email) continue

      await sendOperationalEmail({
        to: customer.email,
        subject: 'הספר שלך נשלח להדפסה',
        html: `<p>הי ${customer.full_name || ''},</p><p>הספר שלך התקדם לשלב ההדפסה.</p>`,
        tag: 'order-status',
      })
    }
  }

  return rows || []
}

export async function buildFulfillmentExport(fulfillmentIds: string[]) {
  const rows = await listFulfillmentOrders()
  const selected = rows.filter((row) => fulfillmentIds.includes(row.id))
  const zip = new JSZip()

  const manifestLines = [
    'order_number,customer_name,book_title,address,city,postal_code,binding,page_count,tracking_number',
  ]

  await Promise.all(
    selected.map(async (row) => {
      if (!row.book?.pdf_print_url) return

      const customerName = row.order?.customer_profiles?.full_name || row.shippingAddress?.recipient_name || 'Customer'
      const orderNumber = row.order?.order_number || row.order_id
      const pageCount =
        row.book.params && typeof row.book.params === 'object' && 'length' in row.book.params
          ? row.book.params.length === 'medium'
            ? 18
            : row.book.params.length === 'long'
              ? 24
              : 10
          : row.print_page_count || 10
      const binding = row.print_binding === 'hard' ? 'Hard' : 'Soft'

      const response = await fetch(row.book.pdf_print_url)
      if (!response.ok) return
      const pdfBuffer = await response.arrayBuffer()

      const fileName = `Order${orderNumber}_${sanitizeFilenamePart(customerName)}_${pageCount}p_${binding}.pdf`
      zip.file(fileName, pdfBuffer)

      manifestLines.push(
        [
          orderNumber,
          customerName,
          row.book.title,
          row.shippingAddress?.address_line1 || '',
          row.shippingAddress?.city || '',
          row.shippingAddress?.postal_code || '',
          binding,
          pageCount,
          row.tracking_number || '',
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
    })
  )

  zip.file('manifest.csv', manifestLines.join('\n'))
  return zip.generateAsync({ type: 'nodebuffer' })
}

export async function listTickets() {
  const adminSupabase = await createAdminClient()
  const { data } = await adminSupabase
    .from('support_tickets')
    .select('*, customer_profiles(*), orders(order_number), books(id, title)')
    .order('created_at', { ascending: false })

  return data || []
}

export async function createSupportTicket(input: {
  email: string
  fullName?: string
  phone?: string
  subject: string
  message: string
  bookId?: string | null
  orderId?: string | null
}) {
  const adminSupabase = await createAdminClient()

  let customer = (
    await adminSupabase.from('customer_profiles').select('*').eq('email', input.email).maybeSingle()
  ).data

  if (!customer) {
    customer = (
      await adminSupabase
        .from('customer_profiles')
        .insert({
          email: input.email,
          full_name: input.fullName || null,
          phone: input.phone || null,
          lifecycle_status: 'lead',
        })
        .select('*')
        .single()
    ).data
  }

  if (!customer) {
    throw new Error('Failed to create customer for support ticket')
  }

  const ticket = await adminSupabase
    .from('support_tickets')
    .insert({
      customer_id: customer.id,
      order_id: input.orderId || null,
      book_id: input.bookId || null,
      subject: input.subject,
      message: input.message,
      source: 'contact_form',
      status: 'open',
      priority: 'medium',
    })
    .select('*')
    .single()

  if (!ticket.data) {
    throw new Error('Failed to create support ticket')
  }

  await recordActivity({
    customerId: customer.id,
    orderId: input.orderId || null,
    bookId: input.bookId || null,
    ticketId: ticket.data.id,
    actorType: 'customer',
    eventType: 'ticket.created',
    payload: { source: 'contact_form' },
  })

  return ticket.data
}

export async function createPromotion(input: {
  code: string
  kind: Promotion['kind']
  scope: Promotion['scope']
  amount: number
  usageLimit?: number | null
  expiresAt?: string | null
  assignedCustomerId?: string | null
  isActive?: boolean
}) {
  const adminSupabase = await createAdminClient()
  const result = await adminSupabase
    .from('promotions')
    .insert({
      code: input.code.trim().toUpperCase(),
      kind: input.kind,
      scope: input.scope,
      amount: input.amount,
      usage_limit: input.usageLimit || null,
      expires_at: input.expiresAt || null,
      assigned_customer_id: input.assignedCustomerId || null,
      is_active: input.isActive ?? true,
    })
    .select('*')
    .single()

  return result.data
}

export async function listPromotions() {
  const adminSupabase = await createAdminClient()
  const { data } = await adminSupabase
    .from('promotions')
    .select('*, promotion_redemptions(count)')
    .order('created_at', { ascending: false })

  return data || []
}

export async function generateMarketingAsset(input: {
  type: Tables<'marketing_assets'>['asset_type']
  topic: string
  goal?: string
  segmentDescription?: string
  segmentSnapshot?: Json
  staffUserId?: string
}) {
  const adminSupabase = await createAdminClient()
  const generated = await generateMarketingContent({
    type: input.type as 'blog_post' | 'social_post' | 'newsletter' | 'upsell_insert',
    topic: input.topic,
    goal: (input.goal as 'sales' | 'education' | 'engagement' | undefined) || 'sales',
    segmentDescription: input.segmentDescription,
  })

  const { data } = await adminSupabase
    .from('marketing_assets')
    .insert({
      asset_type: input.type,
      topic: input.topic,
      goal: input.goal || null,
      title: generated.title,
      status: 'draft',
      segment_snapshot: input.segmentSnapshot || {},
      content: generated.content,
      meta: { summary: generated.summary },
      created_by_staff_user_id: input.staffUserId || null,
    })
    .select('*')
    .single()

  return data
}

export async function listMarketingAssets() {
  const adminSupabase = await createAdminClient()
  const { data } = await adminSupabase
    .from('marketing_assets')
    .select('*')
    .order('created_at', { ascending: false })

  return data || []
}

export async function exportAudience(input: {
  tags?: string[]
  lifecycleStatus?: string[]
  assetId?: string | null
  staffUserId?: string
}) {
  const adminSupabase = await createAdminClient()
  let query = adminSupabase.from('customer_profiles').select('*')

  if (input.lifecycleStatus?.length) {
    query = query.in('lifecycle_status', input.lifecycleStatus)
  }

  const { data: customers } = await query.order('created_at', { ascending: false })
  const rows = customers || []
  const fileName = `audience-${Date.now()}.csv`
  const snapshot = rows.map((customer) => ({
    id: customer.id,
    full_name: customer.full_name,
    email: customer.email,
    lifecycle_status: customer.lifecycle_status,
    customer_type: customer.customer_type,
  }))

  const { data } = await adminSupabase
    .from('audience_exports')
    .insert({
      asset_id: input.assetId || null,
      filters: {
        tags: input.tags || [],
        lifecycleStatus: input.lifecycleStatus || [],
      },
      export_format: 'csv',
      file_name: fileName,
      record_count: rows.length,
      snapshot,
      created_by_staff_user_id: input.staffUserId || null,
    })
    .select('*')
    .single()

  const csv = [
    'customer_id,full_name,email,lifecycle_status,customer_type',
    ...rows.map((customer) =>
      [
        customer.id,
        customer.full_name || '',
        customer.email,
        customer.lifecycle_status,
        customer.customer_type,
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n')

  return { exportRow: data, csv }
}

async function regenerateBookPageImageOverride(input: {
  bookId: string
  pageId: string
  prompt?: string
}) {
  const adminSupabase = await createAdminClient()

  const { data: book } = await adminSupabase
    .from('books')
    .select('params')
    .eq('id', input.bookId)
    .single()

  const { data: page } = await adminSupabase
    .from('book_pages')
    .select('image_prompt, image_url')
    .eq('id', input.pageId)
    .single()

  const { data: characters } = await adminSupabase.from('characters').select('*').eq('book_id', input.bookId)

  const characterImageBase64s = await Promise.all(
    (characters || []).map(async (char: { name: string; image_url?: string | null }) => {
      if (!char.image_url) return null
      try {
        const res = await fetch(char.image_url)
        const buffer = await res.arrayBuffer()
        return {
          name: char.name,
          base64: Buffer.from(buffer).toString('base64'),
          mimeType: res.headers.get('content-type') || 'image/jpeg',
        }
      } catch {
        return null
      }
    })
  ).then((rows) => rows.filter(Boolean) as { name: string; base64: string; mimeType: string }[])

  const bookParams = book?.params as { characters: { name: string; role: string }[] }
  const imageBuffer = await generatePageImage(
    input.prompt || page?.image_prompt || '',
    bookParams.characters as Parameters<typeof generatePageImage>[1],
    bookParams as Parameters<typeof generatePageImage>[2],
    characterImageBase64s
  )

  const filePath = `books/${input.bookId}/page-${input.pageId}-support-${Date.now()}.jpg`
  await adminSupabase.storage.from('book-images').upload(filePath, imageBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  })
  const { data: publicUrl } = adminSupabase.storage.from('book-images').getPublicUrl(filePath)

  await adminSupabase
    .from('book_pages')
    .update({
      image_url: publicUrl.publicUrl,
      image_prompt: input.prompt || page?.image_prompt || '',
    })
    .eq('id', input.pageId)

  await adminSupabase.from('regeneration_log').insert({
    book_id: input.bookId,
    page_id: input.pageId,
    type: 'image',
    old_value: page?.image_url,
    new_value: publicUrl.publicUrl,
  })

  return publicUrl.publicUrl
}

export async function resolveTicketWithCoupon(input: {
  ticketId: string
  staffUserId?: string
  amount: number
  kind: Promotion['kind']
}) {
  const adminSupabase = await createAdminClient()
  const { data: ticket } = await adminSupabase
    .from('support_tickets')
    .select('*, customer_profiles(*)')
    .eq('id', input.ticketId)
    .single()

  if (!ticket?.customer_profiles) {
    throw new Error('לא נמצא לקוח מקושר לפנייה.')
  }

  const code = `COMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const promotion = await createPromotion({
    code,
    kind: input.kind,
    scope: 'single_use',
    amount: input.amount,
    assignedCustomerId: ticket.customer_id,
    usageLimit: 1,
  })

  if (!promotion) {
    throw new Error('יצירת קופון הפיצוי נכשלה.')
  }

  await adminSupabase
    .from('support_tickets')
    .update({
      status: 'resolved',
      resolution_type: 'coupon',
      resolution_payload: { promotionId: promotion.id, code },
      closed_at: new Date().toISOString(),
    })
    .eq('id', input.ticketId)

  await recordActivity({
    customerId: ticket.customer_id,
    ticketId: input.ticketId,
    actorType: 'staff',
    actorStaffUserId: input.staffUserId || null,
    eventType: 'ticket.resolved_with_coupon',
    payload: { code, amount: input.amount, kind: input.kind },
  })

  await sendOperationalEmail({
    to: ticket.customer_profiles.email,
    subject: 'קופון פיצוי אישי עבורך',
    html: `<p>הי ${ticket.customer_profiles.full_name || ''},</p><p>יצרנו עבורך קופון אישי: <strong>${code}</strong>.</p>`,
    tag: 'comp-coupon',
  })

  return promotion
}

export async function resolveTicketWithRefund(input: {
  ticketId: string
  amount: number
  staffUserId?: string
}) {
  const adminSupabase = await createAdminClient()
  const { data: ticket } = await adminSupabase
    .from('support_tickets')
    .select('*, orders(*), customer_profiles(*)')
    .eq('id', input.ticketId)
    .single()

  if (!ticket?.orders) {
    throw new Error('לא נמצאה הזמנה מקושרת לפנייה.')
  }

  const order = ticket.orders as Order
  if (order.source !== 'stripe') {
    throw new Error('אפשר לבצע זיכוי אוטומטי רק להזמנות שחויבו דרך Stripe.')
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('מפתח Stripe לא הוגדר במערכת הניהול.')
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  await stripe.refunds.create({
    payment_intent: order.stripe_payment_intent_id || undefined,
    amount: input.amount,
  })

  await adminSupabase.from('payment_transactions').insert({
    order_id: order.id,
    customer_id: order.customer_id,
    provider: 'stripe',
    kind: 'refund',
    status: 'succeeded',
    amount: -Math.abs(input.amount),
    currency: order.currency,
    provider_transaction_id: order.stripe_payment_intent_id,
    payload: { ticketId: input.ticketId },
  })

  await adminSupabase.from('orders').update({ status: 'refunded' }).eq('id', order.id)
  await adminSupabase
    .from('support_tickets')
    .update({
      status: 'resolved',
      resolution_type: 'refund',
      resolution_payload: { amount: input.amount },
      closed_at: new Date().toISOString(),
    })
    .eq('id', input.ticketId)

  await recordActivity({
    customerId: ticket.customer_id,
    orderId: order.id,
    ticketId: input.ticketId,
    actorType: 'staff',
    actorStaffUserId: input.staffUserId || null,
    eventType: 'ticket.refund_issued',
    payload: { amount: input.amount },
  })
}

export async function resolveTicketWithRegenerateOverride(input: {
  ticketId: string
  pageId: string
  prompt?: string
  staffUserId?: string
}) {
  const adminSupabase = await createAdminClient()
  const { data: ticket } = await adminSupabase
    .from('support_tickets')
    .select('*')
    .eq('id', input.ticketId)
    .single()

  if (!ticket?.book_id) {
    throw new Error('הפנייה אינה מקושרת לספר.')
  }

  const imageUrl = await regenerateBookPageImageOverride({
    bookId: ticket.book_id,
    pageId: input.pageId,
    prompt: input.prompt,
  })

  await adminSupabase
    .from('support_tickets')
    .update({
      status: 'resolved',
      resolution_type: 'regenerate_override',
      resolution_payload: { pageId: input.pageId, imageUrl },
      closed_at: new Date().toISOString(),
    })
    .eq('id', input.ticketId)

  await recordActivity({
    customerId: ticket.customer_id,
    orderId: ticket.order_id,
    bookId: ticket.book_id,
    ticketId: ticket.id,
    actorType: 'staff',
    actorStaffUserId: input.staffUserId || null,
    eventType: 'ticket.regenerate_override',
    payload: { pageId: input.pageId, imageUrl },
  })

  return imageUrl
}

export async function handleStripeEvent(event: Stripe.Event) {
  const adminSupabase = await createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { data: order } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('stripe_checkout_session_id', session.id)
      .maybeSingle()

    if (order) {
      await adminSupabase
        .from('orders')
        .update({
          source: 'stripe',
          status: 'paid',
          stripe_payment_intent_id:
            typeof session.payment_intent === 'string' ? session.payment_intent : null,
          paid_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      await adminSupabase.from('payment_transactions').insert({
        order_id: order.id,
        customer_id: order.customer_id,
        provider: 'stripe',
        kind: 'charge',
        status: 'succeeded',
        amount: order.total_amount,
        currency: order.currency,
        provider_transaction_id:
          typeof session.payment_intent === 'string' ? session.payment_intent : session.id,
        stripe_event_id: event.id,
        payload: session as unknown as Json,
      })
    }
  }

  if (event.type === 'charge.refunded' || event.type === 'refund.updated') {
    const object = event.data.object as Stripe.Refund | Stripe.Charge
    const paymentIntentId =
      'payment_intent' in object && typeof object.payment_intent === 'string'
        ? object.payment_intent
        : null

    if (paymentIntentId) {
      const { data: order } = await adminSupabase
        .from('orders')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .maybeSingle()

      if (order) {
        await adminSupabase.from('orders').update({ status: 'refunded' }).eq('id', order.id)
        await adminSupabase.from('payment_transactions').insert({
          order_id: order.id,
          customer_id: order.customer_id,
          provider: 'stripe',
          kind: 'refund',
          status: 'succeeded',
          amount:
            'amount_refunded' in object ? -Math.abs(object.amount_refunded) : -Math.abs(object.amount || 0),
          currency: order.currency,
          provider_transaction_id: paymentIntentId,
          stripe_event_id: event.id,
          payload: object as unknown as Json,
        })
      }
    }
  }
}
