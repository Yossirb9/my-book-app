'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function PaymentSuccessPage() {
  const [bookId, setBookId] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(4)

  useEffect(() => {
    const storedId = localStorage.getItem('pendingBookId')
    if (storedId) {
      setBookId(storedId)
      localStorage.removeItem('pendingBookId')
    }
  }, [])

  useEffect(() => {
    if (!bookId || countdown <= 0) {
      if (bookId && countdown <= 0) {
        window.location.href = `/book/${bookId}/creating?start=1`
      }
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [bookId, countdown])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#141414] px-4 py-10">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-white shadow-2xl shadow-black/30 backdrop-blur">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-coral-500/20 text-3xl text-coral-400">
          ✓
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-300">תשלום אושר</p>
        <h1 className="mt-3 text-3xl font-black">תודה על הרכישה!</h1>

        {bookId ? (
          <>
            <p className="mt-4 text-sm leading-7 text-white/70">
              הספר שלכם מוכן לייצור. בעוד {countdown} שניות נתחיל ביצירה אוטומטית.
            </p>
            <div className="mt-8">
              <Link href={`/book/${bookId}/creating?start=1`}>
                <Button size="lg" className="w-full sm:w-auto">
                  התחילו ליצור עכשיו
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm leading-7 text-white/70">
              הספר שלכם נמצא ברשימת הספרים שלי וימתין לכם שם.
            </p>
            <div className="mt-8">
              <Link href="/books">
                <Button size="lg" className="w-full sm:w-auto">
                  הספרים שלי
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
