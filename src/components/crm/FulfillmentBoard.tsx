'use client'

import { useMemo, useState, useTransition } from 'react'
import { FULFILLMENT_STATUSES, FULFILLMENT_STATUS_LABELS } from '@/lib/crm/constants'
import { formatCurrency } from '@/lib/crm/utils'

type FulfillmentItem = {
  id: string
  status: string
  tracking_number: string | null
  print_binding: string
  print_page_count: number | null
  order: {
    id: string
    order_number: number
    total_amount: number
    customer_profiles?: { full_name: string | null; email: string }
  } | null
  shippingAddress: {
    recipient_name: string
    city: string
    address_line1: string
  } | null
  book: {
    id: string
    title: string
  } | null
}

export default function FulfillmentBoard({ items }: { items: FulfillmentItem[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const grouped = useMemo(
    () =>
      FULFILLMENT_STATUSES.map((status) => ({
        status,
        label: FULFILLMENT_STATUS_LABELS[status as keyof typeof FULFILLMENT_STATUS_LABELS],
        items: items.filter((item) => item.status === status),
      })),
    [items]
  )

  const toggleSelection = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    )
  }

  const applyStatus = (status: string) => {
    startTransition(async () => {
      setMessage('')
      const response = await fetch('/api/admin/fulfillment/bulk-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentIds: selectedIds, status }),
      })

      if (!response.ok) {
        setMessage('עדכון הסטטוס נכשל.')
        return
      }

      setMessage(
        `עודכנו ${selectedIds.length} הזמנות לסטטוס ${
          FULFILLMENT_STATUS_LABELS[status as keyof typeof FULFILLMENT_STATUS_LABELS]
        }.`
      )
      setTimeout(() => window.location.reload(), 400)
    })
  }

  const exportBatch = () => {
    const params = new URLSearchParams()
    selectedIds.forEach((id) => params.append('id', id))
    window.location.href = `/api/admin/fulfillment/export?${params.toString()}`
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-coral-100 bg-[#FFF9F0] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-500">
            Bulk actions
          </p>
          <p className="mt-2 text-sm text-gray-600">
            נבחרו כרגע {selectedIds.length} הזמנות לעדכון או לייצוא.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyStatus('sent_to_printer')}
            disabled={!selectedIds.length || isPending}
            className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            סמן כנשלח לדפוס
          </button>
          <button
            type="button"
            onClick={() => applyStatus('shipped')}
            disabled={!selectedIds.length || isPending}
            className="rounded-full border border-coral-300 px-4 py-2 text-sm font-semibold text-coral-600 disabled:opacity-50"
          >
            סמן כנשלח ללקוח
          </button>
          <button
            type="button"
            onClick={exportBatch}
            disabled={!selectedIds.length || isPending}
            className="rounded-full border border-[#1a1a2e]/20 px-4 py-2 text-sm font-semibold text-[#1a1a2e] disabled:opacity-50"
          >
            ייצוא ZIP + מניפסט
          </button>
        </div>
      </div>

      {message ? <p className="text-sm font-semibold text-coral-600">{message}</p> : null}

      <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        {grouped.map((column) => (
          <section
            key={column.status}
            className="rounded-[1.5rem] border border-coral-100 bg-[#fffaf4] p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-black text-[#1a1a2e]">{column.label}</h2>
              <span className="rounded-full bg-coral-50 px-2 py-1 text-xs font-semibold text-coral-600">
                {column.items.length}
              </span>
            </div>

            <div className="space-y-3">
              {column.items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.25rem] border border-coral-100 bg-white p-3 shadow-sm"
                >
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      className="mt-1 h-4 w-4 rounded border-coral-300"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">
                        Order {item.order?.order_number || item.id.slice(0, 8)}
                      </p>
                      <h3 className="mt-2 text-sm font-black text-[#1a1a2e]">
                        {item.book?.title || 'ספר ללא כותרת'}
                      </h3>
                      <p className="mt-2 text-sm text-gray-700">
                        {item.order?.customer_profiles?.full_name ||
                          item.shippingAddress?.recipient_name ||
                          item.order?.customer_profiles?.email}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.shippingAddress?.city || 'ללא כתובת'} · {item.print_page_count || 0}{' '}
                        עמודים · {item.print_binding === 'hard' ? 'כריכה קשה' : 'כריכה רכה'}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-coral-600">
                        {formatCurrency(item.order?.total_amount || 0)}
                      </p>
                    </div>
                  </label>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
