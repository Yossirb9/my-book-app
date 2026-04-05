import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CUSTOMER_LIFECYCLE_LABELS,
  CUSTOMER_TYPE_LABELS,
  FULFILLMENT_STATUS_LABELS,
  ORDER_STATUS_LABELS,
  getActivityEventLabel,
  getBookLengthLabel,
  getBookStatusLabel,
  getBookTypeLabel,
} from '@/lib/crm/constants'
import { getCustomerDetail } from '@/lib/crm/service'
import { formatCurrency } from '@/lib/crm/utils'
import { Json } from '@/lib/supabase/database.types'

function getJsonString(record: Json | null | undefined, key: string) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return null
  }

  const value = key in record ? record[key] : null
  return typeof value === 'string' ? value : null
}

export default async function BackofficeCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const detail = await getCustomerDetail(id)

  if (!detail) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link href="/customers" className="text-sm font-semibold text-coral-600">
        חזרה לרשימת הלקוחות
      </Link>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[1.75rem] border border-coral-100 bg-[#FFF9F0] p-6">
          <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">פרופיל לקוח</p>
          <h1 className="mt-4 text-4xl font-black text-[#15201f]">
            {detail.customer.full_name || detail.customer.email}
          </h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] bg-white p-4">
              <p className="text-sm text-[#677872]">אימייל</p>
              <p className="mt-2 font-semibold text-[#15201f]">{detail.customer.email}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white p-4">
              <p className="text-sm text-[#677872]">טלפון</p>
              <p className="mt-2 font-semibold text-[#15201f]">{detail.customer.phone || 'לא הוזן'}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white p-4">
              <p className="text-sm text-[#677872]">סטטוס לקוח</p>
              <p className="mt-2 font-semibold text-[#15201f]">
                {
                  CUSTOMER_LIFECYCLE_LABELS[
                    detail.customer.lifecycle_status as keyof typeof CUSTOMER_LIFECYCLE_LABELS
                  ]
                }
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-white p-4">
              <p className="text-sm text-[#677872]">ערך חיי לקוח</p>
              <p className="mt-2 font-semibold text-[#15201f]">{formatCurrency(detail.ltv)}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white p-4">
              <p className="text-sm text-[#677872]">סוג לקוח</p>
              <p className="mt-2 font-semibold text-[#15201f]">
                {CUSTOMER_TYPE_LABELS[detail.customer.customer_type as keyof typeof CUSTOMER_TYPE_LABELS] ||
                  'פרטי'}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-white p-4">
              <p className="text-sm text-[#677872]">מקור הגעה</p>
              <p className="mt-2 font-semibold text-[#15201f]">
                {detail.customer.utm_source || detail.customer.utm_campaign || 'לא תועד'}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-coral-100 bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">תגיות והערות</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.tags.length ? (
              detail.tags.map((tagAssignment) => (
                <span
                  key={tagAssignment.id}
                  className="rounded-full px-3 py-1 text-sm font-semibold text-white"
                  style={{ backgroundColor: tagAssignment.customer_tags?.color || '#16332f' }}
                >
                  {tagAssignment.customer_tags?.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-[#64756f]">עדיין לא הוגדרו תגיות ללקוח הזה.</p>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {detail.notes.length ? (
              detail.notes.map((note) => (
                <div key={note.id} className="rounded-[1.25rem] border border-coral-100 p-4">
                  <p className="text-sm leading-7 text-[#15201f]">{note.body}</p>
                  <p className="mt-2 text-xs text-[#6b7d76]">
                    {new Date(note.created_at).toLocaleString('he-IL')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#64756f]">עדיין לא נוספו הערות פנימיות.</p>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-coral-100 bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">הזמנות והפקה</p>
          <div className="mt-4 space-y-3">
            {detail.orders.length ? (
              detail.orders.map((order) => {
                const firstItem = Array.isArray(order.order_items) ? order.order_items[0] : null
                const template = getJsonString(firstItem?.metadata as Json | null, 'template')
                const length = getJsonString(firstItem?.metadata as Json | null, 'length')

                return (
                  <div key={order.id} className="rounded-[1.25rem] border border-coral-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-[#15201f]">
                          הזמנה #{order.order_number || order.id.slice(0, 8)}
                        </p>
                        <p className="mt-1 text-sm text-[#657872]">
                          {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#15201f]">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                      <p>סוג ספר: {getBookTypeLabel(template)}</p>
                      <p>אורך: {getBookLengthLabel(length)}</p>
                    </div>

                    {order.fulfillment_orders ? (
                      <p className="mt-3 text-sm text-coral-600">
                        {
                          FULFILLMENT_STATUS_LABELS[
                            order.fulfillment_orders.status as keyof typeof FULFILLMENT_STATUS_LABELS
                          ]
                        }
                      </p>
                    ) : null}
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-gray-600">עדיין לא נוצרו הזמנות ללקוח הזה.</p>
            )}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-coral-100 bg-white p-6">
          <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">יומן פעילות</p>
          <div className="mt-4 space-y-3">
            {detail.activities.length ? (
              detail.activities.map((activity) => (
                <div key={activity.id} className="rounded-[1.25rem] border border-coral-100 p-4">
                  <p className="text-sm font-semibold text-[#15201f]">
                    {getActivityEventLabel(activity.event_type)}
                  </p>
                  <p className="mt-1 text-xs text-[#677872]">
                    {new Date(activity.created_at).toLocaleString('he-IL')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">עדיין לא נרשמה פעילות לכרטיס הזה.</p>
            )}
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-coral-100 bg-white p-6">
        <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">ספרים שנוצרו</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {detail.books.length ? (
            detail.books.map((book) => (
              <div key={book.id} className="rounded-[1.25rem] border border-coral-100 p-4">
                <p className="text-sm font-black text-[#15201f]">{book.title}</p>
                <div className="mt-2 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                  <p>סוג ספר: {getBookTypeLabel(getJsonString(book.params as Json | null, 'template'))}</p>
                  <p>אורך: {getBookLengthLabel(getJsonString(book.params as Json | null, 'length'))}</p>
                  <p>סטטוס: {getBookStatusLabel(book.status)}</p>
                  <p>{new Date(book.created_at).toLocaleString('he-IL')}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">עדיין לא נוצרו ספרים עבור הלקוח הזה.</p>
          )}
        </div>
      </section>
    </div>
  )
}
