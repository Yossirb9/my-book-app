'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('אימייל או סיסמה שגויים')
    } else {
      router.push('/books')
    }
    setLoading(false)
  }

  return (
    <main className="flex flex-col min-h-dvh bg-[#FFF9F0] justify-center px-6">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">📖</div>
        <h1 className="text-2xl font-black text-gray-800">הספר שלי</h1>
        <p className="text-gray-500 text-sm mt-1">כניסה לחשבון</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-coral-400 text-right"
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-coral-400 text-right"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button size="lg" type="submit" loading={loading}>
          כניסה
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        אין לכם חשבון?{' '}
        <Link href="/signup" className="text-coral-500 font-semibold">
          הרשמה
        </Link>
      </p>
    </main>
  )
}
