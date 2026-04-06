'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import CreateShell from '@/components/create/CreateShell'
import { getBookTitlePreview, getCharacterDisplayRole, getPrimaryCharacter, isEnsembleTemplate } from '@/lib/characters'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useCreateBookStore } from '@/store/createBookStore'
import { BOOK_PRICES, JOURNAL_PRICE, LENGTH_PAGES, TEMPLATE_LABELS } from '@/types'

function SummaryItem({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-[1rem] border border-white/10 bg-white/6 px-3.5 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{label}</p>
      <p className="mt-1 text-base font-black leading-tight text-white">{value}</p>
      {detail ? <p className="mt-0.5 text-xs leading-5 text-white/62">{detail}</p> : null}
    </div>
  )
}

export default function StepPayment() {
  const { params, prevStep, setShowAuthGate, showAuthGate, reset } = useCreateBookStore()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isJournal = params.template === 'emotional_journal'
  const isEnsemble = isEnsembleTemplate(params.template)
  const digitalPrice = isJournal ? JOURNAL_PRICE : params.length ? BOOK_PRICES[params.length] : BOOK_PRICES.short
  const totalPagesLabel = isJournal
    ? '30 עמודים · 5 פרקים'
    : `${LENGTH_PAGES[params.length || 'long'].label} · 24 תמונות`
  const mainCharacter =
    params.template && params.characters
      ? getPrimaryCharacter({ template: params.template, characters: params.characters })?.name
      : null
  const previewTitle =
    params.template && params.characters
      ? getBookTitlePreview({ template: params.template, characters: params.characters })
      : 'הספר שלכם'
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

  const handleGoToPayment = async () => {
    if (!isAuthenticated) {
      setShowAuthGate(true)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/books/create-pending', {
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
        throw new Error(data.error || 'לא הצלחנו לשמור את הספר.')
      }

      localStorage.setItem('pendingBookId', data.bookId as string)
      reset()
      window.location.href = 'https://pay.grow.link/8f93290f83a3d0fa830a20e9ebadfc93-MzI2MDA5Ng'
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'אירעה שגיאה לא צפויה.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CreateShell
      step={4}
      onBack={prevStep}
      bare
      footer={
        <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[20rem]">
          <Button
            size="lg"
            onClick={handleGoToPayment}
            loading={loading}
            className="w-full lg:min-w-[18rem] lg:px-8 lg:py-3 lg:text-[15px]"
          >
            {isAuthenticated ? 'המשך לתשלום' : 'התחברו כדי לשלם'}
          </Button>
          {error ? <p className="rounded-[0.9rem] bg-red-50 px-3.5 py-2 text-sm text-red-600">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="max-w-[44rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-400">רגע האישור</p>
          <h2 className="mt-1 text-[1.65rem] font-black leading-tight text-white">מסכמים את ההזמנה</h2>
          <p className="mt-1 text-sm leading-5 text-white/55">בחרו איך תרצו לקבל את הספר ולחצו להמשך לתשלום.</p>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_1.12fr] xl:items-start">
          <aside className="space-y-3 xl:order-1">
            <section className="rounded-[1.65rem] border border-white/10 bg-[linear-gradient(180deg,#171925_0%,#10111a_100%)] p-4 text-white shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-coral-300">סיכום</p>
                  <h3 className="mt-1.5 text-[2rem] font-black leading-tight">{previewTitle}</h3>
                </div>
                <Badge variant="ready">מוכן לאישור</Badge>
              </div>

              <p className="mt-2 text-sm leading-5 text-white/70">
                {isJournal
                  ? 'יומן העצמה משפחתי עם פרקים, שאלות לשיח ומסרים אישיים.'
                  : isEnsemble
                    ? 'ספר משפחתי שבו כל הדמויות מופיעות כחלק מאותו סיפור משותף.'
                    : 'ספר אישי בעברית עם דמויות אמיתיות, עלילה מקורית ותוצאה שמוכנה לקריאה.'}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {params.characters?.map((character) => (
                  <span key={character.id} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90">
                    {character.name || 'דמות חדשה'}
                    {character.familyRole ? ` · ${getCharacterDisplayRole(character)}` : ''}
                  </span>
                ))}
              </div>

              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                <SummaryItem label="נושא הספר" value={params.template ? TEMPLATE_LABELS[params.template] : 'טרם נבחר'} />
                <SummaryItem label="משך יצירה" value={estimatedTime} />
                <SummaryItem label="אורך" value={totalPagesLabel} />
                <SummaryItem
                  label="דמויות"
                  value={`${params.characters?.length || 0} דמויות`}
                  detail={isEnsemble ? 'כל הדמויות שוות בחשיבותן' : mainCharacter || 'דמות ראשית אחת'}
                />
                <SummaryItem label="ניקוד" value={params.includeNikud ? 'עם ניקוד' : 'ללא ניקוד'} />
                <SummaryItem label="מסר" value={params.desiredMessage || 'לא הוגדר מסר'} />
              </div>
            </section>

            {!isAuthenticated || showAuthGate ? (
              <section className="rounded-[1.5rem] border border-black/5 bg-[#FFF9F0] p-4 shadow-sm">
                <h3 className="text-base font-black text-[#161625]">צריך רק להתחבר לפני שמשלמים</h3>
                <p className="mt-1 text-sm leading-5 text-gray-600">כל הפרטים נשמרו. התחברו ונחזיר אתכם ישר לכאן.</p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  <Link href="/login?returnTo=/create" className="block">
                    <Button size="md" className="w-full">כניסה</Button>
                  </Link>
                  <Link href="/signup?returnTo=/create" className="block">
                    <Button variant="outline" size="md" className="w-full">הרשמה</Button>
                  </Link>
                </div>
              </section>
            ) : null}
          </aside>

          <section className="xl:order-2">
            <div className="rounded-[1.65rem] border border-black/5 bg-[#FFF9F0] p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">בחירת הזמנה</p>
              <h3 className="mt-1 text-[1.6rem] font-black text-[#161625]">איך תרצו לקבל את הספר?</h3>

              <div className="mt-3 grid gap-2.5 md:grid-cols-2">
                {/* Digital — active */}
                <div className="rounded-[1.2rem] border border-coral-300 bg-coral-50 px-3.5 py-3 shadow-[0_14px_26px_rgba(232,124,83,0.10)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-black text-[#161625]">PDF דיגיטלי</p>
                      <p className="mt-0.5 text-sm leading-5 text-gray-500">קובץ מוכן לקריאה ולשליחה כמתנה</p>
                    </div>
                    <span className="rounded-full bg-[#FFF3E7] px-2.5 py-1 text-sm font-semibold text-coral-700">
                      ₪{digitalPrice}
                    </span>
                  </div>
                </div>

                {/* Physical — coming soon */}
                <div className={cn('rounded-[1.2rem] border border-black/5 bg-white px-3.5 py-3 opacity-60')}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-black text-[#161625]">ספר מודפס</p>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">בקרוב</span>
                      </div>
                      <p className="mt-0.5 text-sm leading-5 text-gray-400">הדפסה ומשלוח לכתובת שתבחרו</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </CreateShell>
  )
}
