'use client'

import { FormEvent, useState, useTransition } from 'react'

export default function MarketingGenerator() {
  const [message, setMessage] = useState('')
  const [exportMessage, setExportMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = {
      type: String(formData.get('type') || 'blog_post'),
      topic: String(formData.get('topic') || ''),
      goal: String(formData.get('goal') || 'sales'),
      segmentDescription: String(formData.get('segmentDescription') || ''),
    }

    startTransition(async () => {
      setMessage('')
      const response = await fetch('/api/admin/marketing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        setMessage('יצירת הטיוטה נכשלה.')
        return
      }

      setMessage('נשמרה טיוטה חדשה במאגר התוכן.')
      setTimeout(() => window.location.reload(), 500)
    })
  }

  const exportAudience = () => {
    startTransition(async () => {
      setExportMessage('')
      const response = await fetch('/api/admin/marketing/audience-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lifecycleStatus: ['paying', 'returning'] }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setExportMessage('ייצוא הקהל נכשל.')
        return
      }

      const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8' })
      const href = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = href
      anchor.download = data.fileName || 'audience.csv'
      anchor.click()
      URL.revokeObjectURL(href)
      setExportMessage('קובץ הקהל נוצר והורד.')
    })
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleGenerate} className="rounded-[1.5rem] border border-coral-100 bg-[#FFF9F0] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-500">
          AI content machine
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select name="type" className="rounded-xl border border-coral-100 px-3 py-2 text-sm">
            <option value="blog_post">מאמר SEO</option>
            <option value="social_post">פוסט סושיאל</option>
            <option value="newsletter">ניוזלטר</option>
            <option value="upsell_insert">דף הורים לספר</option>
          </select>
          <select name="goal" className="rounded-xl border border-coral-100 px-3 py-2 text-sm">
            <option value="sales">קידום מכירות</option>
            <option value="education">ערך חינוכי</option>
            <option value="engagement">מעורבות</option>
          </select>
          <input
            name="topic"
            placeholder="פחד מהחושך"
            className="rounded-xl border border-coral-100 px-3 py-2 text-sm xl:col-span-2"
            required
          />
          <input
            name="segmentDescription"
            placeholder="הורים שרכשו מתנת סוף שנה"
            className="rounded-xl border border-coral-100 px-3 py-2 text-sm md:col-span-2 xl:col-span-4"
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            צור טיוטה
          </button>
          {message ? <p className="text-sm font-semibold text-coral-600">{message}</p> : null}
        </div>
      </form>

      <div className="rounded-[1.5rem] border border-coral-100 bg-white p-4">
        <p className="text-sm font-black text-[#1a1a2e]">Audience export</p>
        <p className="mt-2 text-sm leading-7 text-gray-600">
          ייצוא קהל לקוחות בפורמט CSV לשליחה דרך מערכת חיצונית.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={exportAudience}
            disabled={isPending}
            className="rounded-full border border-coral-300 px-4 py-2 text-sm font-semibold text-coral-600 disabled:opacity-50"
          >
            ייצא paying + returning
          </button>
          {exportMessage ? <p className="text-sm font-semibold text-coral-600">{exportMessage}</p> : null}
        </div>
      </div>
    </div>
  )
}
