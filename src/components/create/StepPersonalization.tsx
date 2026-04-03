'use client'
import { useCreateBookStore } from '@/store/createBookStore'
import Button from '@/components/ui/Button'
import { StepProgress } from '@/components/ui/StepProgress'
import { cn } from '@/lib/utils'

export default function StepPersonalization() {
  const { nextStep, prevStep, params, setPersonalization } = useCreateBookStore()

  const languageLevels = [
    { id: 'toddler' as const, label: 'פעוטות 0-2' },
    { id: 'kindergarten' as const, label: 'גן 3-5' },
    { id: 'early_reader' as const, label: 'ראשית קריאה 6+' },
  ]

  const isValid = params.relationship

  return (
    <div className="flex flex-col min-h-dvh">
      <div className="flex items-center justify-between px-4 pt-8 pb-4">
        <button onClick={prevStep} className="text-gray-400 text-sm">← חזרה</button>
        <StepProgress currentStep={4} totalSteps={5} />
        <div className="w-10" />
      </div>

      <div className="px-4 pb-4">
        <h2 className="text-xl font-bold text-gray-800">ספרו לנו עוד</h2>
        <p className="text-sm text-gray-500 mt-1">הפרטים האלה יהפכו את הספר לאישי באמת</p>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-24">
        {/* Relationship */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1.5 text-sm">
            מה הקשר בין הדמויות? <span className="text-coral-500">*</span>
          </label>
          <input
            type="text"
            placeholder="לדוגמה: אחות גדולה ואח תינוק"
            value={params.relationship || ''}
            onChange={(e) => setPersonalization({ relationship: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-coral-400 text-right bg-white"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1.5 text-sm">
            מה המסר שתרצו להעביר?
          </label>
          <textarea
            rows={3}
            placeholder="לדוגמה: שתהיה לך שנה מלאת הרפתקות..."
            value={params.desiredMessage || ''}
            onChange={(e) => setPersonalization({ desiredMessage: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-coral-400 text-right bg-white resize-none"
          />
        </div>

        {/* Personal Details */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1.5 text-sm">
            פרטים אישיים נוספים (אופציונלי)
          </label>
          <textarea
            rows={3}
            placeholder="גיל, תחביבים, חיות מחמד, דברים אהובים..."
            value={params.personalDetails || ''}
            onChange={(e) => setPersonalization({ personalDetails: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-coral-400 text-right bg-white resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-left">{(params.personalDetails || '').length}/200</p>
        </div>

        {/* Language Level */}
        <div>
          <p className="font-semibold text-gray-700 mb-2 text-sm">רמת שפה</p>
          <div className="grid grid-cols-3 gap-2">
            {languageLevels.map((l) => (
              <button
                key={l.id}
                onClick={() => setPersonalization({ languageLevel: l.id })}
                className={cn(
                  'py-2 px-2 rounded-xl text-xs font-medium border-2 transition-all text-center',
                  params.languageLevel === l.id
                    ? 'border-coral-500 bg-coral-50 text-coral-700'
                    : 'border-gray-100 bg-white text-gray-600'
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nikud Toggle */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
          <label className="font-semibold text-gray-700 text-sm">הוסף ניקוד לטקסט</label>
          <button
            onClick={() => setPersonalization({ includeNikud: !params.includeNikud })}
            className={cn(
              'relative w-12 h-6 rounded-full transition-colors duration-200',
              params.includeNikud ? 'bg-coral-500' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200',
                params.includeNikud ? 'right-0.5' : 'left-0.5'
              )}
            />
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FFF9F0] to-transparent">
        <Button size="lg" onClick={nextStep} disabled={!isValid}>
          המשך לתשלום ›
        </Button>
      </div>
    </div>
  )
}
