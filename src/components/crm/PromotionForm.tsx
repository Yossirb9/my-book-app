'use client'

import { FormEvent, useState, useTransition } from 'react'

export default function PromotionForm() {
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = {
      code: String(formData.get('code') || ''),
      kind: String(formData.get('kind') || 'percentage'),
      scope: String(formData.get('scope') || 'campaign'),
      amount: Number(formData.get('amount') || 0),
      usageLimit: Number(formData.get('usageLimit') || 0) || null,
      expiresAt: String(formData.get('expiresAt') || '') || null,
    }

    startTransition(async () => {
      setMessage('')
      const response = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        setMessage('לא הצלחנו ליצור את הקופון.')
        return
      }

      setMessage('הקופון נוצר בהצלחה.')
      setTimeout(() => window.location.reload(), 400)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-coral-100 bg-[#FFF9F0] p-4">
      <p className="text-xs font-semibold tracking-[0.24em] text-coral-500">קופון חדש</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input
          name="code"
          placeholder="SUMMER2026"
          className="rounded-xl border border-coral-100 px-3 py-2 text-sm"
          required
        />
        <select name="kind" className="rounded-xl border border-coral-100 px-3 py-2 text-sm">
          <option value="percentage">אחוזים</option>
          <option value="fixed">סכום קבוע</option>
        </select>
        <select name="scope" className="rounded-xl border border-coral-100 px-3 py-2 text-sm">
          <option value="campaign">קמפיין ציבורי</option>
          <option value="single_use">חד-פעמי אישי</option>
        </select>
        <input
          name="amount"
          type="number"
          min="1"
          placeholder="20"
          className="rounded-xl border border-coral-100 px-3 py-2 text-sm"
          required
        />
        <input
          name="usageLimit"
          type="number"
          min="1"
          placeholder="100"
          className="rounded-xl border border-coral-100 px-3 py-2 text-sm"
        />
        <input
          name="expiresAt"
          type="datetime-local"
          className="rounded-xl border border-coral-100 px-3 py-2 text-sm md:col-span-2 xl:col-span-2"
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          צור קופון
        </button>
        {message ? <p className="text-sm font-semibold text-coral-600">{message}</p> : null}
      </div>
    </form>
  )
}
