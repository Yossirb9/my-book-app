'use client'

import Link from 'next/link'
import { Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

function GoogleButton({ returnTo, loading, onStart }: { returnTo: string; loading: boolean; onStart: () => void }) {
  const handleGoogleSignup = async () => {
    onStart()
    const supabase = createClient()
    const callbackUrl = `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl },
    })
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignup}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
    >
      <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
      </svg>
      הרשמה עם Google
    </button>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-medium text-gray-400">או</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  )
}

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

      <div className="space-y-4">
        <GoogleButton returnTo={returnTo} loading={loading} onStart={() => setLoading(true)} />

        <Divider />

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
      </div>

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
