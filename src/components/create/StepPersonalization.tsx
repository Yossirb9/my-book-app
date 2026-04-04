'use client'

import Button from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { StepProgress } from '@/components/ui/StepProgress'
import { cn } from '@/lib/utils'
import { useCreateBookStore } from '@/store/createBookStore'

const languageLevels = [
  { id: 'toddler' as const, label: 'פעוטות', hint: 'קצב רגוע ומשפטים קצרים מאוד' },
  { id: 'kindergarten' as const, label: 'גן', hint: 'שפה ביתית וקריאה זורמת בהקראה' },
  { id: 'early_reader' as const, label: 'ראשית קריאה', hint: 'טקסט עשיר יותר לילדים גדולים יותר' },
]

export default function StepPersonalization() {
  const { nextStep, params, prevStep, setPersonalization } = useCreateBookStore()
  const isValid = Boolean(params.relationship?.trim())

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex items-start justify-between gap-4 px-4 pt-7 pb-5 md:px-6">
        <button type="button" onClick={prevStep} className="pt-1 text-sm font-medium text-gray-500 hover:text-gray-800">
          חזרה
        </button>
        <StepProgress currentStep={4} />
        <div className="w-12" />
      </div>

      <div className="px-4 pb-6 md:px-6">
        <h1 className="text-2xl font-black text-gray-900 md:text-3xl">מה חשוב שייכנס לסיפור?</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600 md:text-base">
          כאן אתם מוסיפים את הלב של הספר: הקשר בין הדמויות, המסר שתרצו להעביר והפרטים הקטנים שהופכים את התוצאה לשלכם.
        </p>
      </div>

      <div className="space-y-5 px-4 pb-28 md:px-6">
        <Input
          label="מה הקשר בין הדמויות?"
          placeholder="למשל: אחות גדולה ואח קטן, ילדה וסבא, שני אחים עם כלב"
          value={params.relationship || ''}
          onChange={(event) => setPersonalization({ relationship: event.target.value })}
          helperText="המידע הזה ישפיע על הקשר, השפה והאינטראקציה בסיפור."
          required
        />

        <Textarea
          label="איזה מסר תרצו שהספר יעביר?"
          rows={4}
          placeholder="למשל: שגם כשיש שינוי בבית, תמיד נשאר מקום לאהבה, ביטחון והומור."
          value={params.desiredMessage || ''}
          onChange={(event) => setPersonalization({ desiredMessage: event.target.value })}
          helperText="לא חובה, אבל מאוד עוזר לנו לדייק את הלב של העלילה."
        />

        <Textarea
          label="פרטים אישיים שנרצה לשלב"
          rows={4}
          placeholder="תחביבים, חיות מחמד, בדיחות פנימיות, פחדים קטנים, מאכל אהוב, מקום אהוב, או כל פרט שיגרום לסיפור להרגיש אמיתי."
          value={params.personalDetails || ''}
          onChange={(event) => setPersonalization({ personalDetails: event.target.value })}
          helperText={`${(params.personalDetails || '').length}/200`}
          maxLength={200}
        />

        <section className="rounded-[2rem] border border-white bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900">רמת השפה</h2>
            <p className="text-sm text-gray-500">נתאים את אורך המשפטים, הקצב ורמת המורכבות לקוראים הצפויים.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {languageLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setPersonalization({ languageLevel: level.id })}
                className={cn(
                  'rounded-[1.75rem] border-2 p-4 text-right transition-all',
                  params.languageLevel === level.id
                    ? 'border-coral-500 bg-coral-50 shadow-md shadow-coral-100'
                    : 'border-gray-100 bg-[#FFF9F0] hover:border-coral-200'
                )}
              >
                <p className="font-bold text-gray-900">{level.label}</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">{level.hint}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-between rounded-[2rem] border border-white bg-white px-5 py-4 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-gray-900">ניקוד בטקסט</h2>
            <p className="text-sm text-gray-500">מומלץ בעיקר לקהל צעיר או להקראה משותפת.</p>
          </div>
          <button
            type="button"
            onClick={() => setPersonalization({ includeNikud: !params.includeNikud })}
            className={cn(
              'relative h-7 w-14 rounded-full transition-colors',
              params.includeNikud ? 'bg-coral-500' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all',
                params.includeNikud ? 'right-1' : 'left-1'
              )}
            />
          </button>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[640px] bg-gradient-to-t from-[#FFF9F0] via-[#FFF9F0] px-4 pt-4 pb-6 md:px-6">
        <Button size="lg" onClick={nextStep} disabled={!isValid}>
          המשיכו לתצוגה ואישור
        </Button>
      </div>
    </div>
  )
}
