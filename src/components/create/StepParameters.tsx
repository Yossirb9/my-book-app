'use client'

import Button from '@/components/ui/Button'
import CreateShell from '@/components/create/CreateShell'
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
    <CreateShell
      step={2}
      onBack={prevStep}
      badge="מגדירים את המוצר"
      footer={
        <div className="lg:min-w-[18rem]">
          <Button size="lg" onClick={nextStep} disabled={!isValid} className="w-full lg:min-w-[18rem]">
            המשיכו לדמויות
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <section className="grid gap-4 xl:grid-cols-2">
          {directions.map((direction) => (
            <button
              key={direction.id}
              type="button"
              onClick={() => setDirection(direction.id)}
              className={cn(
                'rounded-[2rem] border p-5 text-right transition-all',
                params.emotionalDirection === direction.id
                  ? 'border-coral-300 bg-[linear-gradient(160deg,#fff8f1_0%,#fde7dd_100%)] shadow-[0_22px_40px_rgba(232,124,83,0.14)]'
                  : 'border-black/5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(23,25,37,0.10)]'
              )}
            >
              <p className="text-lg font-black text-[#161625]">{direction.label}</p>
              <p className="mt-2 text-sm leading-7 text-gray-500">{direction.hint}</p>
            </button>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#161625]">למי הספר מיועד?</h2>
              <p className="mt-1 text-sm leading-7 text-gray-500">רמת שפה, אורך משפטים וקצב קריאה מותאמים לגיל היעד.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setAgeGroup(group.id)}
                className={cn(
                  'rounded-[1.75rem] border p-5 text-right transition-all',
                  params.ageGroup === group.id
                    ? 'border-coral-300 bg-coral-50 shadow-[0_18px_32px_rgba(232,124,83,0.12)]'
                    : 'border-black/5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(23,25,37,0.08)]'
                )}
              >
                <p className="text-2xl font-black text-[#161625]">{group.label}</p>
                <p className="mt-2 text-sm leading-7 text-gray-500">{group.hint}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 2xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-[#161625]">אורך הספר</h2>
              <p className="mt-1 text-sm leading-7 text-gray-500">כאן בוחרים אם זו חוויה קצרה, מאוזנת או רחבה באמת.</p>
            </div>
            <div className="grid gap-4">
              {lengths.map((length) => (
                <button
                  key={length.id}
                  type="button"
                  onClick={() => setLength(length.id)}
                  className={cn(
                    'rounded-[2rem] border p-6 text-right transition-all',
                    params.length === length.id
                      ? 'border-coral-300 bg-[linear-gradient(160deg,#fff8f1_0%,#fde7dd_100%)] shadow-[0_22px_40px_rgba(232,124,83,0.14)]'
                      : 'border-black/5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(23,25,37,0.10)]'
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-2xl font-black text-[#161625]">{length.label}</p>
                      <p className="mt-1 text-sm text-gray-500">{length.pages}</p>
                    </div>
                    <span className="rounded-full bg-[#FFF3E7] px-3 py-1 text-xs font-semibold text-coral-700">
                      {length.scenes}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-gray-600">הכי מתאים ל־{length.bestFor}.</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-[#161625]">פורמט סופי</h2>
              <p className="mt-1 text-sm leading-7 text-gray-500">כך הספר ירגיש במסך ובקובץ הסופי.</p>
            </div>
            <div className="grid gap-4">
              {formats.map((format) => (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => setFormat(format.id)}
                  className={cn(
                    'rounded-[2rem] border p-6 text-right transition-all',
                    params.format === format.id
                      ? 'border-coral-300 bg-coral-50 shadow-[0_18px_32px_rgba(232,124,83,0.12)]'
                      : 'border-black/5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(23,25,37,0.08)]'
                  )}
                >
                  <p className="text-xl font-black text-[#161625]">{format.label}</p>
                  <p className="mt-2 text-sm leading-7 text-gray-500">{format.hint}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </CreateShell>
  )
}
