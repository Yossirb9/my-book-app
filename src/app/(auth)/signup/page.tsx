'use client'

import Link from 'next/link'
import { Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/books'
  const isReturningToCreate = returnTo === '/create'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtitle = useMemo(() => {
    if (isReturningToCreate) {
      return 'פתחו חשבון קצרצר, והספר שהתחלתם יישאר בדיוק במקום שבו עצרתם.'
    }

    return 'יוצרים חשבון כדי לשמור ספרים, לערוך אותם ולחזור אליהם מכל מכשיר.'
  }, [isReturningToCreate])

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signupError } = await supabase.auth.signUp({ email, password })

    if (signupError) {
      setError(signupError.message)
    } else {
      router.push(returnTo)
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white bg-white p-6 shadow-lg shadow-coral-100/60">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">פותחים חשבון</p>
        <h1 className="mt-3 text-3xl font-black text-gray-900">מתחילים לשמור ספרים</h1>
        <p className="mt-2 text-sm leading-7 text-gray-600">{subtitle}</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          type="email"
          label="אימייל"
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          type="password"
          label="סיסמה"
          placeholder="לפחות 6 תווים"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={error || undefined}
          minLength={6}
          required
        />
        <Button size="lg" type="submit" loading={loading}>
          הרשמה והמשך
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        כבר יש לכם חשבון?{' '}
        <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-coral-600">
          כניסה
        </Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#FFF9F0] px-4 py-10">
      <Suspense fallback={<div className="h-40" />}>
        <SignupForm />
      </Suspense>
    </main>
  )
}
