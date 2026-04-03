'use client'
import { useCreateBookStore } from '@/store/createBookStore'
import Button from '@/components/ui/Button'
import { StepProgress } from '@/components/ui/StepProgress'
import Link from 'next/link'

export default function StepBookType() {
  const { nextStep, setTemplate, params } = useCreateBookStore()

  const templates = [
    {
      id: 'new_sibling' as const,
      emoji: '👶',
      title: 'אח חדש / אחות חדשה',
      desc: 'ספר שיעזור לאח/אחות הגדולים לקבל את התינוק החדש',
      price: 'מ-₪89',
    },
    {
      id: 'birthday_child' as const,
      emoji: '🎂',
      title: 'יום הולדת לילד',
      desc: 'ספר מותאם אישית עם הגיבור/ת האמיתיים',
      price: 'מ-₪89',
    },
    {
      id: 'potty_training' as const,
      emoji: '🌟',
      title: 'גמילה מחיתולים',
      desc: 'ספר שיעשה את השלב הזה כיף ומעצים',
      price: 'מ-₪89',
    },
    {
      id: 'family_love' as const,
      emoji: '❤️',
      title: 'ספר אהבה משפחתי',
      desc: 'מתנה רגשית שתישאר לתמיד',
      price: 'מ-₪99',
    },
  ]

  const handleSelect = (id: typeof templates[0]['id']) => {
    setTemplate(id)
    nextStep()
  }

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-8 pb-4">
        <Link href="/" className="text-gray-400 text-sm">← חזרה</Link>
        <StepProgress currentStep={1} totalSteps={5} />
        <div className="w-10" />
      </div>

      <div className="px-4 pb-4">
        <h2 className="text-xl font-bold text-gray-800">איזה ספר תרצו לצור?</h2>
        <p className="text-sm text-gray-500 mt-1">בחרו תבנית מוכנה</p>
      </div>

      {/* Template Cards */}
      <div className="flex flex-col gap-3 px-4 pb-6">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`w-full text-right p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
              params.template === t.id
                ? 'border-coral-500 bg-coral-50 shadow-md'
                : 'border-gray-100 bg-white shadow-sm hover:border-coral-200'
            }`}
          >
            <span className="text-3xl">{t.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-800">{t.title}</p>
                <span className="text-xs text-coral-500 font-semibold">{t.price}</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-auto px-4 pb-8">
        <p className="text-center text-xs text-gray-400">
          כל הספרים כוללים PDF דיגיטלי + קובץ מוכן להדפסה
        </p>
      </div>
    </div>
  )
}
