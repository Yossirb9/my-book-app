'use client'

import { FormEvent, useState } from 'react'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'

type FormState = {
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
}

const INITIAL_STATE: FormState = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('failed')
      }

      setSuccess('ההודעה נשלחה בהצלחה. נחזור אליכם בהקדם.')
      setForm(INITIAL_STATE)
    } catch {
      setError('לא הצלחנו לשלוח את ההודעה כרגע. אפשר לנסות שוב בעוד רגע.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-coral-100 bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="שם מלא"
          name="fullName"
          value={form.fullName}
          onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
          placeholder="איך נוכל לפנות אליכם?"
        />
        <Input
          label="אימייל"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="name@example.com"
        />
        <Input
          label="טלפון"
          name="phone"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          placeholder="לא חובה"
        />
        <Input
          label="נושא"
          name="subject"
          required
          value={form.subject}
          onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
          placeholder="במה נוכל לעזור?"
        />
      </div>

      <div className="mt-4">
        <Textarea
          label="הודעה"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          placeholder="כתבו לנו מה חשוב לכם שנדע"
        />
      </div>

      {error ? <p aria-live="polite" className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
      {success ? <p aria-live="polite" className="mt-4 text-sm font-medium text-emerald-700">{success}</p> : null}

      <div className="mt-6">
        <Button type="submit" size="lg" loading={isSubmitting} className="sm:w-auto">
          שלחו הודעה
        </Button>
      </div>
    </form>
  )
}
