'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import CreateShell from '@/components/create/CreateShell'
import { createClient } from '@/lib/supabase/client'
import { useCreateBookStore } from '@/store/createBookStore'
import { BOOK_PRICES, DIRECTION_LABELS, JOURNAL_PRICE, LENGTH_PAGES, TEMPLATE_LABELS } from '@/types'

const nextSteps = [
  'מאשרים את ההזמנה ומתחילים את היצירה.',
  'המערכת כותבת את הסיפור, מייצרת איורים ומכינה PDF.',
  'מקבלים ספר מוכן לקריאה, הורדה ועריכה בסיסית.',
]

export default function StepPayment() {
  const { params, prevStep, reset, setShowAuthGate, showAuthGate } = useCreateBookStore()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isJournal = params.template === 'emotional_journal'
  const price = isJournal ? JOURNAL_PRICE : (params.length ? BOOK_PRICES[params.length] : BOOK_PRICES.short)
  const totalPagesLabel = isJournal ? '30 עמודים · 5 פרקים' : (params.length ? LENGTH_PAGES[params.length].label : LENGTH_PAGES.short.label)
  const mainCharacter = params.characters?.find((character) => character.role === 'main')?.name
  const estimatedTime = useMemo(() => {
    if (isJournal) return 'כ-6 דקות'
    if (params.length === 'long') return 'כ-5 דקות'
    if (params.length === 'medium') return 'כ-4 דקות'
    return 'כ-3 דקות'
  }, [isJournal, params.length])

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
    <CreateShell
      step={5}
      onBack={prevStep}
      badge="מסך החלטה"
      footer={
        <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[20rem]">
          <Button size="lg" onClick={handleConfirm} loading={loading} className="w-full lg:min-w-[20rem]">
            {isAuthenticated ? 'אשרו והתחילו ליצור' : 'התחברו כדי להתחיל יצירה'}
          </Button>
          {error ? <p className="rounded-[1.25rem] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
        </div>
      }
    >
      <div className="grid gap-6 2xl:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-5">
          <section className="overflow-hidden rounded-[2.2rem] border border-black/5 shadow-sm">
            <div className="grid gap-0 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="bg-[linear-gradient(180deg,#171925_0%,#10111a_100%)] p-6 text-white lg:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-coral-300">Preview</p>
                <h2 className="mt-4 text-3xl font-black leading-tight">
                  {isJournal
                    ? mainCharacter ? `היומן של ${mainCharacter}` : 'היומן שלכם'
                    : mainCharacter ? `הספר של ${mainCharacter}` : 'הספר שלכם'}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/72">
                  {isJournal
                    ? 'יומן העצמה משפחתי עם 5 פרקים, 30 עמודים, שאלות לשיח ואיורים מותאמים אישית.'
                    : 'ספר מותאם אישית בעברית, עם דמויות אמיתיות, עלילה שנבנית סביב המשפחה שלכם וקובץ PDF מוכן לקריאה.'}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-white/8 p-4">
                    <p className="text-white/55">משך יצירה</p>
                    <p className="mt-1 text-lg font-bold text-white">{estimatedTime}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-white/8 p-4">
                    <p className="text-white/55">אורך משוער</p>
                    <p className="mt-1 text-lg font-bold text-white">{totalPagesLabel}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[linear-gradient(180deg,#fffaf3_0%,#fff4e6_100%)] p-6 lg:p-8">
                <div className="rounded-[1.9rem] border border-coral-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-coral-700">הספר שבחרתם</p>
                    <Badge variant="popular">מוכן לאישור</Badge>
                  </div>
                  <h3 className="mt-3 text-2xl font-black text-[#161625]">
                    {params.template ? TEMPLATE_LABELS[params.template] : 'ספר אישי'}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {params.emotionalDirection
                      ? DIRECTION_LABELS[params.emotionalDirection]
                      : 'הטון יוגדר לפי הבחירה שלכם מהשלב הקודם.'}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {params.characters?.map((character) => (
                      <span key={character.id} className="rounded-full bg-coral-50 px-3 py-1 text-xs font-semibold text-coral-700">
                        {character.name || 'דמות חדשה'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm lg:p-6">
            <h2 className="text-2xl font-black text-[#161625]">סיכום הבחירות</h2>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <div className="rounded-[1.6rem] bg-[#FFF9F0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">נושא הספר</p>
                <p className="mt-2 text-lg font-black text-[#161625]">
                  {params.template ? TEMPLATE_LABELS[params.template] : 'טרם נבחר'}
                </p>
              </div>
              <div className="rounded-[1.6rem] bg-[#FFF9F0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">אורך וסגנון</p>
                <p className="mt-2 text-lg font-black text-[#161625]">
                  {totalPagesLabel}
                  {params.emotionalDirection ? ` · ${DIRECTION_LABELS[params.emotionalDirection]}` : ''}
                </p>
              </div>
              <div className="rounded-[1.6rem] bg-[#FFF9F0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">דמויות</p>
                <p className="mt-2 text-lg font-black text-[#161625]">{params.characters?.length || 0} דמויות</p>
                <p className="mt-1 text-sm text-gray-500">{mainCharacter || 'ללא שם ראשי'} · תמונה אחת לכל דמות</p>
              </div>
              <div className="rounded-[1.6rem] bg-[#FFF9F0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">מסר והקשר</p>
                <p className="mt-2 text-lg font-black text-[#161625]">{params.relationship || 'לא הוגדר עדיין קשר בין הדמויות'}</p>
                <p className="mt-1 text-sm text-gray-500">{params.includeNikud ? 'עם ניקוד' : 'ללא ניקוד'}</p>
              </div>
            </div>
          </section>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">מחיר הספר</p>
                <p className="mt-1 text-4xl font-black text-coral-700">₪{price}</p>
              </div>
              <Badge variant="popular">כולל PDF ועריכות בסיסיות</Badge>
            </div>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              אם בהמשך יוגדר checkout אמיתי, נעביר לתשלום מאובטח. כרגע האישור מתחיל את תהליך היצירה עצמו.
            </p>
          </section>

          <section className="rounded-[2rem] border border-black/5 bg-[#171925] p-5 text-white shadow-[0_20px_40px_rgba(23,25,37,0.18)]">
            <h2 className="text-xl font-black">מה קורה אחרי האישור?</h2>
            <div className="mt-4 space-y-3">
              {nextSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-coral-200">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-white/72">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {!isAuthenticated || showAuthGate ? (
            <section className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-[#161625]">צריך רק להתחבר לפני שמתחילים</h2>
              <p className="mt-2 text-sm leading-7 text-gray-600">
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
        </aside>
      </div>
    </CreateShell>
  )
}
