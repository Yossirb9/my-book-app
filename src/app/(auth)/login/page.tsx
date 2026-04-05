'use client'

import Link from 'next/link'
import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function GoogleButton({
  returnTo,
  loading,
  acceptedTerms,
  onStart,
}: {
  returnTo: string
  loading: boolean
  acceptedTerms: boolean
  onStart: () => void
}) {
  const handleGoogleLogin = async () => {
    if (!acceptedTerms) return

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
      onClick={handleGoogleLogin}
      disabled={loading || !acceptedTerms}
      className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] border border-gray-200 bg-white px-5 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
      </svg>
      המשיכו עם Google
    </button>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/books'
  const isReturningToCreate = returnTo === '/create'
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const subtitle = useMemo(() => {
    if (isReturningToCreate) {
      return 'ההתקדמות שלכם ביצירת הספר נשמרה. התחברו ונחזיר אתכם בדיוק לשלב האחרון.'
    }
    return 'התחברו לחשבון שלכם כדי לראות ספרים, להמשיך יצירה או לערוך ספר קיים.'
  }, [isReturningToCreate])

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white bg-white p-8 shadow-lg shadow-coral-100/60">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">כניסה לחשבון</p>
        <h1 className="mt-3 text-3xl font-black text-gray-900">חוזרים לספר שלכם</h1>
        <p className="mt-2 text-sm leading-7 text-gray-600">{subtitle}</p>
      </div>

      <label className="mb-4 flex items-start gap-3 rounded-[1.25rem] bg-[#FFF9F0] p-4 text-sm leading-6 text-gray-700">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-coral-600 focus:ring-coral-500"
        />
        <span>
          אני מאשר/ת את{' '}
          <Link href="/terms" target="_blank" className="font-semibold text-coral-600 underline underline-offset-2">
            תנאי השימוש
          </Link>
        </span>
      </label>

      <GoogleButton
        returnTo={returnTo}
        loading={loading}
        acceptedTerms={acceptedTerms}
        onStart={() => setLoading(true)}
      />

      {!acceptedTerms ? (
        <p className="mt-3 text-center text-xs text-gray-500">כדי להתחבר עם Google צריך לאשר קודם את תנאי השימוש.</p>
      ) : null}

      <p className="mt-6 text-center text-sm text-gray-500">
        עדיין אין לכם חשבון?{' '}
        <Link href={`/signup?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-coral-600">
          הרשמה מהירה
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#FFF9F0] px-4 py-10">
      <Suspense fallback={<div className="h-40" />}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
