'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type AdminLoginFormProps = {
  initialError?: string
}

function resolveErrorMessage(errorCode?: string) {
  switch (errorCode) {
    case 'unauthorized':
      return 'החשבון המחובר עדיין לא מורשה להיכנס למערכת הניהול.'
    case 'auth_failed':
      return 'ההתחברות עם Google לא הושלמה. אפשר לנסות שוב.'
    default:
      return ''
  }
}

export default function AdminLoginForm({ initialError }: AdminLoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(resolveErrorMessage(initialError))

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError('')
      const supabase = createClient()
      const callbackUrl = `${window.location.origin}/auth/callback`

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callbackUrl },
      })

      if (authError) {
        throw authError
      }
    } catch (caughtError) {
      setLoading(false)
      setError(caughtError instanceof Error ? caughtError.message : 'לא הצלחנו להתחבר כרגע.')
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-coral-100 bg-white p-8">
      <p className="text-xs font-semibold tracking-[0.28em] text-coral-500">מערכת ניהול</p>
      <h1 className="mt-4 text-4xl font-black text-[#1a1a2e]">כניסה למערכת</h1>
      <p className="mt-3 text-sm leading-7 text-gray-600">
        הכניסה מיועדת רק למשתמשים מורשים במערכת הפנימית. אחרי ההתחברות נבדוק את ההרשאות
        לפני טעינת סביבת הניהול.
      </p>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-[1.5rem] border border-coral-200 bg-[#FFF9F0] px-5 py-4 text-base font-semibold text-[#1a1a2e] transition hover:bg-[#fff2e8] disabled:opacity-60"
      >
        <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
          <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
        {loading ? 'מעבירים אותך ל-Google...' : 'כניסה עם Google'}
      </button>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
