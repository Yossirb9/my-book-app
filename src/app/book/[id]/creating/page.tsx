'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 'story', label: 'כותב את הסיפור...' },
  { id: 'images', label: 'מצייר את הדמויות...' },
  { id: 'layout', label: 'מעצב את הספר...' },
  { id: 'pdf', label: 'מכין את ה-PDF...' },
]

export default function CreatingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/books/${id}/status`)
      const data = await res.json()

      if (data.status === 'ready') {
        setCurrentStep(4)
        setProgress(100)
        setTimeout(() => router.push(`/book/${id}`), 1500)
        return true
      }
      if (data.status === 'failed') {
        setError('אירעה שגיאה ביצירת הספר. אנא נסו שוב.')
        return true
      }

      // Update progress based on pages generated
      if (data.pagesGenerated !== undefined && data.totalPages) {
        const imageProgress = (data.pagesGenerated / data.totalPages) * 60
        setProgress(20 + imageProgress)
        if (data.pagesGenerated > 0) setCurrentStep(1)
        if (data.pagesGenerated >= data.totalPages) setCurrentStep(2)
      }
      return false
    } catch {
      return false
    }
  }, [id, router])

  useEffect(() => {
    // Start generation
    fetch(`/api/books/${id}/generate`, { method: 'POST' })

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p < 15) return p + 1
        return p
      })
    }, 500)

    // Poll for status
    const pollTimer = setInterval(async () => {
      const done = await pollStatus()
      if (done) {
        clearInterval(pollTimer)
        clearInterval(progressTimer)
      }
    }, 4000)

    return () => {
      clearInterval(pollTimer)
      clearInterval(progressTimer)
    }
  }, [id, pollStatus])

  if (error) {
    return (
      <div className="min-h-dvh bg-[#1A0A2E] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">😔</div>
        <p className="text-white text-lg font-bold mb-2">אירעה שגיאה</p>
        <p className="text-purple-300 text-sm mb-6">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-coral-500 text-white px-6 py-3 rounded-full font-semibold"
        >
          חזרה לדף הבית
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#1A0A2E] to-[#2D1B69] flex flex-col items-center justify-between py-12 px-6">
      {/* Top */}
      <div />

      {/* Center */}
      <div className="flex flex-col items-center text-center gap-6">
        {/* Animated Book */}
        <div className="relative">
          <div className="text-8xl animate-bounce">📖</div>
          <div className="absolute -top-2 -right-2 text-2xl animate-spin" style={{ animationDuration: '3s' }}>✨</div>
          <div className="absolute -bottom-2 -left-2 text-xl animate-ping">⭐</div>
        </div>

        <div>
          <h1 className="text-white text-2xl font-black mb-2">הספר שלך נוצר ✨</h1>
          <p className="text-purple-300 text-sm">הקסם קורה עכשיו...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-coral-400 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3 w-full">
          {STEPS.map((step, idx) => (
            <div key={step.id} className={cn('flex items-center gap-3', idx > currentStep && 'opacity-40')}>
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0',
                idx < currentStep ? 'bg-coral-500 text-white' :
                idx === currentStep ? 'bg-peach-400 text-white animate-pulse' :
                'bg-white/10 text-white/40'
              )}>
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <p className={cn(
                'text-sm font-medium',
                idx === currentStep ? 'text-white' : idx < currentStep ? 'text-coral-300' : 'text-white/40'
              )}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom tip */}
      <div className="bg-white/5 rounded-2xl px-4 py-3 text-center">
        <p className="text-purple-200 text-xs">💡 ידעת? כל עמוד מצויר במיוחד עבורך</p>
        <p className="text-white/30 text-xs mt-1">עוד כ-3-5 דקות...</p>
      </div>
    </div>
  )
}
