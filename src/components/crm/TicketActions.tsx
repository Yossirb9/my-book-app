'use client'

import { useState, useTransition } from 'react'

type TicketActionsProps = {
  ticketId: string
  bookId?: string | null
}

export default function TicketActions({ ticketId, bookId }: TicketActionsProps) {
  const [message, setMessage] = useState('')
  const [refundAmount, setRefundAmount] = useState('8900')
  const [couponAmount, setCouponAmount] = useState('20')
  const [isPending, startTransition] = useTransition()

  const runAction = async (url: string, body: object, successMessage: string) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setMessage(data.error || 'הפעולה נכשלה.')
      return
    }

    setMessage(successMessage)
    setTimeout(() => window.location.reload(), 500)
  }

  return (
    <div className="mt-4 rounded-[1.25rem] border border-coral-100 bg-[#FFF9F0] p-4">
      <p className="text-xs font-semibold tracking-[0.22em] text-coral-500">פעולות מהירות</p>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="rounded-[1rem] border border-coral-100 bg-white p-3">
          <p className="text-sm font-black text-[#1a1a2e]">יצירה מחדש לעמוד</p>
          <p className="mt-2 text-xs leading-6 text-gray-600">
            מפעיל יצירה מחדש של עמוד AI בלי לפגוע במכסה של הלקוח.
          </p>
          <button
            type="button"
            disabled={!bookId || isPending}
            onClick={() =>
              startTransition(() =>
                runAction(
                  `/api/admin/tickets/${ticketId}/actions/regenerate-override`,
                  { pageId: null },
                  'נוצרה יצירה מחדש לעמוד הראשון הזמין בספר.'
                )
              )
            }
            className="mt-3 rounded-full bg-coral-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            הפעל יצירה מחדש
          </button>
        </div>

        <div className="rounded-[1rem] border border-coral-100 bg-white p-3">
          <p className="text-sm font-black text-[#1a1a2e]">זיכוי דרך Stripe</p>
          <input
            value={refundAmount}
            onChange={(event) => setRefundAmount(event.target.value)}
            className="mt-3 w-full rounded-xl border border-coral-100 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(() =>
                runAction(
                  `/api/admin/tickets/${ticketId}/actions/refund`,
                  { amount: Number(refundAmount) },
                  'בקשת הזיכוי נשלחה בהצלחה.'
                )
              )
            }
            className="mt-3 rounded-full border border-coral-300 px-3 py-2 text-xs font-semibold text-coral-600 disabled:opacity-50"
          >
            בצע זיכוי
          </button>
        </div>

        <div className="rounded-[1rem] border border-coral-100 bg-white p-3">
          <p className="text-sm font-black text-[#1a1a2e]">קופון פיצוי</p>
          <input
            value={couponAmount}
            onChange={(event) => setCouponAmount(event.target.value)}
            className="mt-3 w-full rounded-xl border border-coral-100 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(() =>
                runAction(
                  `/api/admin/tickets/${ticketId}/actions/coupon`,
                  { amount: Number(couponAmount), kind: 'percentage' },
                  'נוצר ונשלח קופון פיצוי אישי ללקוח.'
                )
              )
            }
            className="mt-3 rounded-full bg-coral-50 px-3 py-2 text-xs font-semibold text-coral-600 disabled:opacity-50"
          >
            צור קופון
          </button>
        </div>
      </div>

      {message ? <p className="mt-3 text-sm font-semibold text-coral-600">{message}</p> : null}
    </div>
  )
}
