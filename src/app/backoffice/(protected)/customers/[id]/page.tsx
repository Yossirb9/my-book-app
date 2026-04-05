import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCustomerDetail } from '@/lib/crm/service'
import { CUSTOMER_LIFECYCLE_LABELS, FULFILLMENT_STATUS_LABELS, ORDER_STATUS_LABELS } from '@/lib/crm/constants'
import { formatCurrency } from '@/lib/crm/utils'

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
      <Link href="/customers" className="text-sm font-semibold text-[#1d5d48]">
        חזרה לרשימת הלקוחות
      </Link>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[1.75rem] border border-[#d7e3dd] bg-[#fbfdfc] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#667871]">Customer profile</p>
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
              <p className="text-sm text-[#677872]">Lifecycle</p>
              <p className="mt-2 font-semibold text-[#15201f]">
                {
                  CUSTOMER_LIFECYCLE_LABELS[
                    detail.customer.lifecycle_status as keyof typeof CUSTOMER_LIFECYCLE_LABELS
                  ]
                }
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-white p-4">
              <p className="text-sm text-[#677872]">LTV</p>
              <p className="mt-2 font-semibold text-[#15201f]">{formatCurrency(detail.ltv)}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-[#d7e3dd] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#667871]">Tags + notes</p>
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
              <p className="text-sm text-[#64756f]">עדיין אין תגיות ללקוח הזה.</p>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {detail.notes.length ? (
              detail.notes.map((note) => (
                <div key={note.id} className="rounded-[1.25rem] border border-[#e2ebe6] p-4">
                  <p className="text-sm leading-7 text-[#15201f]">{note.body}</p>
                  <p className="mt-2 text-xs text-[#6b7d76]">{new Date(note.created_at).toLocaleString('he-IL')}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#64756f]">עדיין אין הערות פנימיות.</p>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-[#d7e3dd] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#667871]">Orders + fulfillment</p>
          <div className="mt-4 space-y-3">
            {detail.orders.map((order) => (
              <div key={order.id} className="rounded-[1.25rem] border border-[#e3ece7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#15201f]">Order {order.order_number}</p>
                    <p className="mt-1 text-sm text-[#657872]">
                      {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#15201f]">{formatCurrency(order.total_amount)}</p>
                </div>
                {order.fulfillment_orders ? (
                  <p className="mt-3 text-sm text-[#1f5d49]">
                    {
                      FULFILLMENT_STATUS_LABELS[
                        order.fulfillment_orders.status as keyof typeof FULFILLMENT_STATUS_LABELS
                      ]
                    }
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-[#d7e3dd] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#667871]">Activity log</p>
          <div className="mt-4 space-y-3">
            {detail.activities.map((activity) => (
              <div key={activity.id} className="rounded-[1.25rem] border border-[#e3ece7] p-4">
                <p className="text-sm font-semibold text-[#15201f]">{activity.event_type}</p>
                <p className="mt-1 text-xs text-[#677872]">{new Date(activity.created_at).toLocaleString('he-IL')}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-[#d7e3dd] bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#667871]">Books</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {detail.books.map((book) => (
            <div key={book.id} className="rounded-[1.25rem] border border-[#e3ece7] p-4">
              <p className="text-sm font-black text-[#15201f]">{book.title}</p>
              <p className="mt-1 text-sm text-[#667872]">Status: {book.status}</p>
              <p className="mt-1 text-xs text-[#7a8a84]">{new Date(book.created_at).toLocaleString('he-IL')}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
