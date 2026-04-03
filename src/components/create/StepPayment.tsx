'use client'
import { useCreateBookStore } from '@/store/createBookStore'
import Button from '@/components/ui/Button'
import { StepProgress } from '@/components/ui/StepProgress'
import { BOOK_PRICES, LENGTH_PAGES, TEMPLATE_LABELS, DIRECTION_LABELS } from '@/types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StepPayment() {
  const { prevStep, params } = useCreateBookStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const price = params.length ? BOOK_PRICES[params.length] : 89
  const originalPrice = price + 30

  const handlePay = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/books/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'שגיאה ביצירת ההזמנה')
      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        router.push(`/book/${data.bookId}/creating`)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'שגיאה')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <div className="flex items-center justify-between px-4 pt-8 pb-4">
        <button onClick={prevStep} className="text-gray-400 text-sm">← חזרה</button>
        <StepProgress currentStep={5} totalSteps={5} />
        <div className="w-10" />
      </div>

      <div className="px-4 pb-4">
        <h2 className="text-xl font-bold text-gray-800">סיכום הזמנה</h2>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-32">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-coral-100 to-peach-300 flex items-center justify-center text-2xl">
              📖
            </div>
            <div>
              <p className="font-bold text-gray-800">
                {params.template ? TEMPLATE_LABELS[params.template] : 'הספר שלי'}
              </p>
              <p className="text-sm text-gray-500">
                {params.emotionalDirection ? DIRECTION_LABELS[params.emotionalDirection] : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {params.length && (
              <span className="text-xs bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1 text-gray-600">
                {LENGTH_PAGES[params.length].label}
              </span>
            )}
            {params.characters?.map((c) => (
              <span key={c.id} className="text-xs bg-coral-50 border border-coral-100 rounded-full px-2.5 py-1 text-coral-600">
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Included */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="font-bold text-gray-700 mb-2">מה כלול?</p>
          <div className="flex flex-col gap-2">
            {[
              '✅ PDF דיגיטלי',
              '✅ קובץ מוכן להדפסה',
              '✅ 3 תיקוני תמונה',
              '✅ 3 תיקוני טקסט',
            ].map((item) => (
              <p key={item} className="text-sm text-gray-600">{item}</p>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="bg-coral-50 rounded-2xl border border-coral-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 line-through">₪{originalPrice}</p>
            <p className="text-3xl font-black text-coral-600">₪{price}</p>
          </div>
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            חיסכון ₪30
          </span>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-3">{error}</p>
        )}
      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FFF9F0] to-transparent">
        <Button size="lg" onClick={handlePay} loading={loading} className="text-base">
          שלמו ₪{price} וצרו את הספר ✨
        </Button>
        <div className="flex items-center justify-center gap-1 mt-2">
          <span className="text-xs text-gray-400">🔒 תשלום מאובטח SSL</span>
        </div>
      </div>
    </div>
  )
}
