'use client'

import Button from '@/components/ui/Button'
import { StepProgress } from '@/components/ui/StepProgress'
import { cn } from '@/lib/utils'
import { useCreateBookStore } from '@/store/createBookStore'
import { AgeGroup, BookFormat, BookLength, EmotionalDirection } from '@/types'

const directions: { id: EmotionalDirection; label: string; hint: string }[] = [
  { id: 'emotional', label: 'מרגש ועדין', hint: 'מתאים לסיפורים עם לב, קירבה ומסר רגשי.' },
  { id: 'funny', label: 'קליל ומשפחתי', hint: 'טון שובב, מחויך וכזה שכיף לקרוא יחד.' },
  { id: 'empowering', label: 'מעצים ובטוח', hint: 'לרגעים שבהם רוצים לחזק מסוגלות וביטחון.' },
  { id: 'adventurous', label: 'הרפתקני ודמיוני', hint: 'יותר תנועה, גילוי ותחושת מסע.' },
]

const ageGroups: { id: AgeGroup; label: string; hint: string }[] = [
  { id: '0-2', label: '0-2', hint: 'משפטים קצרים וקצב עדין' },
  { id: '3-5', label: '3-5', hint: 'הקראה ביתית עם שפה פשוטה' },
  { id: '6-8', label: '6-8', hint: 'יותר עלילה ויותר טקסט' },
  { id: '9+', label: '9+', hint: 'לילדים שמוכנים לסיפור עשיר' },
]

const lengths: { id: BookLength; label: string; pages: string; bestFor: string; scenes: string }[] = [
  { id: 'short', label: 'קצר', pages: '8-12 עמודים', bestFor: 'מתנה קלילה או סיפור לפני השינה', scenes: '4-5 סצנות מרכזיות' },
  { id: 'medium', label: 'בינוני', pages: '16-20 עמודים', bestFor: 'הבחירה המאוזנת לרוב המשפחות', scenes: '6-8 סצנות עם יותר עומק' },
  { id: 'long', label: 'ארוך', pages: '24-32 עמודים', bestFor: 'חוויה מלאה עם עלילה עשירה יותר', scenes: '9-12 סצנות מפורטות' },
]

const formats: { id: BookFormat; label: string; hint: string }[] = [
  { id: 'square', label: 'פורמט מרובע', hint: 'נוח למסך ולמתנה אישית.' },
  { id: 'portrait', label: 'פורמט לאורך', hint: 'מרגיש כמו ספר ילדים קלאסי להדפסה.' },
]

export default function StepParameters() {
  const { nextStep, params, prevStep, setAgeGroup, setDirection, setFormat, setLength } =
    useCreateBookStore()

  const isValid = Boolean(params.emotionalDirection && params.ageGroup && params.length && params.format)

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex items-start justify-between gap-4 px-4 pt-7 pb-5 md:px-6">
        <button type="button" onClick={prevStep} className="pt-1 text-sm font-medium text-gray-500 hover:text-gray-800">
          חזרה
        </button>
        <StepProgress currentStep={2} />
        <div className="w-12" />
      </div>

      <div className="px-4 pb-6 md:px-6">
        <h1 className="text-2xl font-black text-gray-900 md:text-3xl">איך הספר ירגיש?</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600 md:text-base">
          כאן אנחנו קובעים את האופי של הסיפור: הטון, גיל היעד, האורך והפורמט הסופי שתקבלו.
        </p>
      </div>

      <div className="space-y-6 px-4 pb-28 md:px-6">
        <section>
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900">טון רגשי</h2>
            <p className="text-sm text-gray-500">בחרו איך הספר צריך להרגיש כשהוא נקרא בקול.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {directions.map((direction) => (
              <button
                key={direction.id}
                type="button"
                onClick={() => setDirection(direction.id)}
                className={cn(
                  'rounded-[2rem] border-2 p-4 text-right transition-all',
                  params.emotionalDirection === direction.id
                    ? 'border-coral-500 bg-coral-50 shadow-md shadow-coral-100'
                    : 'border-white bg-white shadow-sm hover:border-coral-200'
                )}
              >
                <p className="font-bold text-gray-900">{direction.label}</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">{direction.hint}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900">גיל היעד</h2>
            <p className="text-sm text-gray-500">כך נתאים את רמת השפה, אורך המשפטים והקצב.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setAgeGroup(group.id)}
                className={cn(
                  'rounded-[1.75rem] border-2 p-4 text-right transition-all',
                  params.ageGroup === group.id
                    ? 'border-coral-500 bg-coral-50 shadow-md shadow-coral-100'
                    : 'border-white bg-white shadow-sm hover:border-coral-200'
                )}
              >
                <p className="font-bold text-gray-900">{group.label}</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">{group.hint}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900">אורך הספר</h2>
            <p className="text-sm text-gray-500">זה מה שישפיע בעיקר על עומק העלילה וכמות הסצנות.</p>
          </div>
          <div className="grid gap-3">
            {lengths.map((length) => (
              <button
                key={length.id}
                type="button"
                onClick={() => setLength(length.id)}
                className={cn(
                  'rounded-[2rem] border-2 p-5 text-right transition-all',
                  params.length === length.id
                    ? 'border-coral-500 bg-coral-50 shadow-md shadow-coral-100'
                    : 'border-white bg-white shadow-sm hover:border-coral-200'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{length.label}</p>
                    <p className="text-sm text-gray-500">{length.pages}</p>
                  </div>
                  <span className="rounded-full bg-[#FFF9F0] px-3 py-1 text-xs font-semibold text-gray-700">
                    {length.scenes}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">הכי מתאים ל־{length.bestFor}.</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900">פורמט סופי</h2>
            <p className="text-sm text-gray-500">הפורמט קובע איך הספר יראה במסך ובקובץ להדפסה.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {formats.map((format) => (
              <button
                key={format.id}
                type="button"
                onClick={() => setFormat(format.id)}
                className={cn(
                  'rounded-[2rem] border-2 p-5 text-right transition-all',
                  params.format === format.id
                    ? 'border-coral-500 bg-coral-50 shadow-md shadow-coral-100'
                    : 'border-white bg-white shadow-sm hover:border-coral-200'
                )}
              >
                <p className="font-bold text-gray-900">{format.label}</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">{format.hint}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[640px] bg-gradient-to-t from-[#FFF9F0] via-[#FFF9F0] px-4 pt-4 pb-6 md:px-6">
        <Button size="lg" onClick={nextStep} disabled={!isValid}>
          המשיכו לדמויות
        </Button>
      </div>
    </div>
  )
}
