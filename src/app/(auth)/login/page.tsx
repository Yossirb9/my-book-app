'use client'

import Link from 'next/link'
import { Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/books'
  const isReturningToCreate = returnTo === '/create'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtitle = useMemo(() => {
    if (isReturningToCreate) {
      return 'ההתקדמות שלכם ביצירת הספר נשמרה. התחברו ונחזיר אתכם בדיוק לשלב האחרון.'
    }

    return 'התחברו לחשבון שלכם כדי לראות ספרים, להמשיך יצירה או לערוך ספר קיים.'
  }, [isReturningToCreate])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const email = username.includes('@') ? username : `${username}@test.local`
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError('שם המשתמש או הסיסמה אינם נכונים.')
    } else {
      router.push(returnTo)
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white bg-white p-6 shadow-lg shadow-coral-100/60">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-500">כניסה לחשבון</p>
        <h1 className="mt-3 text-3xl font-black text-gray-900">חוזרים לספר שלכם</h1>
        <p className="mt-2 text-sm leading-7 text-gray-600">{subtitle}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="text"
          label="שם משתמש או אימייל"
          placeholder="למשל: noa@example.com"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <Input
          type="password"
          label="סיסמה"
          placeholder="הקלידו את הסיסמה שלכם"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={error || undefined}
          required
        />
        <Button size="lg" type="submit" loading={loading}>
          כניסה והמשך
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
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
