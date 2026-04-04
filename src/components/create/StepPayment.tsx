'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { StepProgress } from '@/components/ui/StepProgress'
import { createClient } from '@/lib/supabase/client'
import { useCreateBookStore } from '@/store/createBookStore'
import { BOOK_PRICES, DIRECTION_LABELS, LENGTH_PAGES, TEMPLATE_LABELS } from '@/types'

const nextSteps = [
  'מאשרים את ההזמנה ומתחילים יצירה.',
  'המערכת כותבת את הסיפור, מייצרת איורים ומכינה PDF.',
  'מקבלים ספר מוכן לקריאה, הורדה ועריכה בסיסית.',
]

export default function StepPayment() {
  const { params, prevStep, reset, setShowAuthGate, showAuthGate } = useCreateBookStore()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const price = params.length ? BOOK_PRICES[params.length] : BOOK_PRICES.short
  const totalPagesLabel = params.length ? LENGTH_PAGES[params.length].label : LENGTH_PAGES.short.label
  const mainCharacter = params.characters?.find((character) => character.role === 'main')?.name
  const estimatedTime = useMemo(() => {
    if (params.length === 'long') return 'כ־5 דקות'
    if (params.length === 'medium') return 'כ־4 דקות'
    return 'כ־3 דקות'
  }, [params.length])

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(Boolean(user))
      if (user) setShowAuthGate(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authed = Boolean(session?.user)
      setIsAuthenticated(authed)
      if (authed) setShowAuthGate(false)
    })

    return () => subscription.unsubscribe()
  }, [setShowAuthGate])

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      setShowAuthGate(true)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/books/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params }),
      })

      const data = await response.json()

      if (response.status === 401) {
        setShowAuthGate(true)
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'לא הצלחנו להתחיל את יצירת הספר כרגע.')
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }

      const nextBookId = data.bookId as string
      reset()
      router.push(`/book/${nextBookId}/creating?start=1`)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'אירעה שגיאה לא צפויה.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex items-start justify-between gap-4 px-4 pt-7 pb-5 md:px-6">
        <button type="button" onClick={prevStep} className="pt-1 text-sm font-medium text-gray-500 hover:text-gray-800">
          חזרה
        </button>
        <StepProgress currentStep={5} />
        <div className="w-12" />
      </div>

      <div className="px-4 pb-6 md:px-6">
        <Badge variant="popular" className="mb-3">
          תצוגה ואישור לפני היצירה
        </Badge>
        <h1 className="text-2xl font-black text-gray-900 md:text-3xl">זה מה שייצא לכם</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600 md:text-base">
          עברו על הסיכום, ודאו שהכול מרגיש נכון, וכשתהיו מוכנים נתחיל ליצור את הספר בפועל.
        </p>
      </div>

      <div className="space-y-5 px-4 pb-32 md:px-6">
        <section className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-sm">
          <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#1a1a2e] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-200">תצוגת ספר לדוגמה</p>
              <h2 className="mt-3 text-2xl font-black leading-tight">
                {mainCharacter ? `הספר של ${mainCharacter}` : 'הספר שלכם'}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                ספר מותאם אישית בעברית, עם דמויות אמתיות, עלילה שנבנית סביב המשפחה שלכם וקובץ PDF מוכן לקריאה.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-[1.5rem] bg-white/10 p-3">
                  <p className="text-white/55">משך יצירה</p>
                  <p className="mt-1 font-bold text-white">{estimatedTime}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/10 p-3">
                  <p className="text-white/55">אורך משוער</p>
                  <p className="mt-1 font-bold text-white">{totalPagesLabel}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF9F0] p-6">
              <div className="rounded-[1.75rem] border border-coral-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-coral-700">הספר שבחרתם</p>
                <h3 className="mt-2 text-xl font-black text-gray-900">
                  {params.template ? TEMPLATE_LABELS[params.template] : 'ספר אישי'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {params.emotionalDirection
                    ? DIRECTION_LABELS[params.emotionalDirection]
                    : 'הטון יוגדר על פי הבחירה שלכם בשלב הקודם.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {params.characters?.map((character) => (
                    <span
                      key={character.id}
                      className="rounded-full bg-coral-50 px-3 py-1 text-xs font-semibold text-coral-700"
                    >
                      {character.name || 'דמות חדשה'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">סיכום הבחירות</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">נושא הספר</p>
                  <p className="text-sm text-gray-500">{params.template ? TEMPLATE_LABELS[params.template] : 'טרם נבחר'}</p>
                </div>
                <Badge variant="default">התחלה טובה</Badge>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">אורך וסגנון</p>
                  <p className="text-sm text-gray-500">
                    {totalPagesLabel}
                    {params.emotionalDirection ? ` • ${DIRECTION_LABELS[params.emotionalDirection]}` : ''}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{params.format === 'square' ? 'מרובע' : 'לאורך'}</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">דמויות</p>
                  <p className="text-sm text-gray-500">{params.characters?.length || 0} דמויות עם תמונה אחת לכל דמות</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{mainCharacter || 'ללא שם ראשי'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">מסר והקשר</p>
                  <p className="text-sm leading-6 text-gray-500">{params.relationship || 'לא הוגדר קשר בין הדמויות.'}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{params.includeNikud ? 'עם ניקוד' : 'ללא ניקוד'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <section className="rounded-[2rem] border border-white bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">מה קורה אחרי האישור?</h2>
              <div className="mt-4 space-y-3">
                {nextSteps.map((step, index) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral-50 text-sm font-bold text-coral-700">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-coral-100 bg-coral-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">מחיר הספר</p>
                  <p className="mt-1 text-3xl font-black text-coral-700">₪{price}</p>
                </div>
                <Badge variant="popular">כולל PDF ועריכות בסיסיות</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                אם בהמשך יוגדר checkout אמיתי, נעביר לתשלום מאובטח. כרגע האישור מתחיל את תהליך היצירה עצמו.
              </p>
            </section>

            {!isAuthenticated || showAuthGate ? (
              <section className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">צריך רק להתחבר לפני שמתחילים</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  מילאתם את כל הספר, והכול נשמר. התחברו או צרו חשבון, ונחזיר אתכם בדיוק לכאן כדי להתחיל ביצירה.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link href="/login?returnTo=/create" className="flex-1">
                    <Button size="md" className="w-full">
                      כניסה והמשך ליצירה
                    </Button>
                  </Link>
                  <Link href="/signup?returnTo=/create" className="flex-1">
                    <Button variant="outline" size="md" className="w-full">
                      הרשמה והמשך
                    </Button>
                  </Link>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        {error ? <p className="rounded-[1.5rem] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[640px] bg-gradient-to-t from-[#FFF9F0] via-[#FFF9F0] px-4 pt-4 pb-6 md:px-6">
        <Button size="lg" onClick={handleConfirm} loading={loading}>
          {isAuthenticated ? 'אשרו והתחילו ליצור' : 'התחברו כדי להתחיל יצירה'}
        </Button>
      </div>
    </div>
  )
}
