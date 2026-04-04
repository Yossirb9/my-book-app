'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 'story', label: 'כותבים את הסיפור', hint: 'מעבדים את התבנית, המסר והפרטים האישיים.' },
  { id: 'images', label: 'מכינים את האיורים', hint: 'כל עמוד מקבל סצנה משלו עם הדמויות שבחרתם.' },
  { id: 'layout', label: 'מסדרים את הספר', hint: 'מחברים טקסט, איורים וזרימה בין העמודים.' },
  { id: 'pdf', label: 'מייצרים PDF', hint: 'מכינים את הקבצים לקריאה ולהורדה.' },
]

type BookStatusResponse = {
  status: 'draft' | 'generating' | 'ready' | 'failed'
  pagesGenerated?: number
  totalPages?: number
}

export default function CreatingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(6)
  const [error, setError] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const [isTriggering, setIsTriggering] = useState(false)
  const startRequested = searchParams.get('start') === '1'
  const retryRequested = searchParams.get('retry') === '1'

  const shouldTrigger = useMemo(() => startRequested || retryRequested, [retryRequested, startRequested])

  const applyProgressFromStatus = useCallback((data: BookStatusResponse) => {
    if (data.status === 'ready') {
      setCurrentStep(4)
      setProgress(100)
      setTimeout(() => router.replace(`/book/${id}`), 1200)
      return true
    }

    if (data.status === 'failed') {
      if (retryRequested || isTriggering) {
        return false
      }
      setError('היצירה נעצרה לפני שהספר הושלם. אפשר להפעיל ניסיון נוסף בלי למלא הכול מחדש.')
      return true
    }

    if (data.status === 'draft') {
      if (isTriggering) {
        return false
      }
      setCurrentStep(0)
      setProgress(4)
      return false
    }

    const pagesGenerated = data.pagesGenerated || 0
    const totalPages = data.totalPages || 1
    const progressRatio = pagesGenerated / totalPages

    setHasStarted(true)
    setProgress(Math.max(12, Math.min(92, Math.round(18 + progressRatio * 68))))

    if (pagesGenerated === 0) {
      setCurrentStep(0)
    } else if (progressRatio < 0.45) {
      setCurrentStep(1)
    } else if (progressRatio < 1) {
      setCurrentStep(2)
    } else {
      setCurrentStep(3)
    }

    return false
  }, [id, isTriggering, retryRequested, router])

  const pollStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/books/${id}/status`)
      const data = (await response.json()) as BookStatusResponse
      return applyProgressFromStatus(data)
    } catch {
      return false
    }
  }, [applyProgressFromStatus, id])

  useEffect(() => {
    let cancelled = false

    const maybeTrigger = async () => {
      if (!shouldTrigger) return

      setIsTriggering(true)
      setError('')

      try {
        const response = await fetch(`/api/books/${id}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(retryRequested ? { retry: true } : {}),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: 'לא הצלחנו להתחיל את היצירה.' }))
          throw new Error(data.error || 'לא הצלחנו להתחיל את היצירה.')
        }

        if (!cancelled) {
          setHasStarted(true)
          setProgress(12)
          router.replace(`/book/${id}/creating`)
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : 'לא הצלחנו להתחיל את היצירה.')
        }
      } finally {
        if (!cancelled) {
          setIsTriggering(false)
        }
      }
    }

    void maybeTrigger()

    return () => {
      cancelled = true
    }
  }, [id, retryRequested, router, shouldTrigger])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    void pollStatus()

    intervalId = setInterval(() => {
      void pollStatus()
    }, 4000)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [pollStatus])

  if (error) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#141414] px-4 py-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-white shadow-2xl shadow-black/30 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-300">היצירה נעצרה</p>
          <h1 className="mt-3 text-3xl font-black">צריך עוד ניסיון אחד</h1>
          <p className="mt-4 text-sm leading-7 text-white/70">{error}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={`/book/${id}/creating?retry=1`}>
              <Button size="lg" className="sm:w-auto">
                נסו שוב עכשיו
              </Button>
            </Link>
            <Link href="/books">
              <Button variant="outline" size="lg" className="border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto">
                חזרה לספרים שלי
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-[linear-gradient(180deg,#141414_0%,#1a1a2e_100%)] px-4 py-8 text-white md:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-4xl flex-col justify-between">
        <header className="flex items-center justify-between gap-4">
          <Link href="/books" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
            חזרה לספרים שלי
          </Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white/70">
            מסך יצירה
          </span>
        </header>

        <section className="grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-300">
              {isTriggering ? 'מתחילים את היצירה' : hasStarted ? 'הספר שלכם בתהליך' : 'מוכנים להתחיל'}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              {hasStarted ? 'הספר נבנה עכשיו, שלב אחרי שלב.' : 'הכול מוכן, נשאר רק להתחיל את היצירה.'}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
              {hasStarted
                ? 'אפשר להשאיר את המסך פתוח או לחזור לספרים שלי. נעדכן כאן כשהספר יהיה מוכן לקריאה ולהורדה.'
                : 'אם הגעתם לכאן בלי להתחיל, אפשר להפעיל את היצירה עכשיו או לחזור אחר כך. אנחנו נייצר את הסיפור, האיורים וה-PDF באותו מסלול.'}
            </p>

            {!hasStarted && !isTriggering ? (
              <div className="mt-6">
                <Link href={`/book/${id}/creating?start=1`}>
                  <Button size="lg" className="sm:w-auto">
                    התחילו ליצור
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">התקדמות היצירה</p>
              <span className="text-sm font-bold text-coral-300">{progress}%</span>
            </div>
            <div className="mb-6 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#e87c53_0%,#ffb347_100%)] transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-4">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    'rounded-[1.5rem] border p-4 transition-all',
                    index < currentStep && 'border-coral-400/50 bg-coral-500/10',
                    index === currentStep && 'border-coral-300 bg-white/10 shadow-lg shadow-coral-900/20',
                    index > currentStep && 'border-white/10 bg-white/5 opacity-60'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                        index < currentStep && 'bg-coral-500 text-white',
                        index === currentStep && 'bg-peach-400 text-[#1a1a2e]',
                        index > currentStep && 'bg-white/10 text-white/40'
                      )}
                    >
                      {index < currentStep ? '✓' : index + 1}
                    </span>
                    <div>
                      <p className={cn('font-bold', index === currentStep ? 'text-white' : 'text-white/80')}>
                        {step.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/55">{step.hint}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 text-center text-sm text-white/60 backdrop-blur">
          בדרך כלל הספר מוכן בתוך 3-5 דקות, תלוי באורך שבחרתם.
        </footer>
      </div>
    </main>
  )
}
