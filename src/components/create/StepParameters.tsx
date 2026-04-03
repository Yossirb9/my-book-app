'use client'
import { useCreateBookStore } from '@/store/createBookStore'
import Button from '@/components/ui/Button'
import { StepProgress } from '@/components/ui/StepProgress'
import { cn } from '@/lib/utils'
import { EmotionalDirection, AgeGroup, BookLength, BookFormat } from '@/types'

export default function StepParameters() {
  const { nextStep, prevStep, params, setDirection, setAgeGroup, setLength, setFormat } =
    useCreateBookStore()

  const directions: { id: EmotionalDirection; label: string }[] = [
    { id: 'emotional', label: '🥹 מרגש ומיוחד' },
    { id: 'funny', label: '😄 מצחיק ומשפחתי' },
    { id: 'empowering', label: '💪 מעצים לגיבור' },
    { id: 'adventurous', label: '🌈 הרפתקני-דמיוני' },
  ]

  const ageGroups: { id: AgeGroup; label: string }[] = [
    { id: '0-2', label: 'פעוטות 0-2' },
    { id: '3-5', label: 'גן 3-5' },
    { id: '6-8', label: 'בית ספר 6-8' },
    { id: '9+', label: 'גדולים 9+' },
  ]

  const lengths: { id: BookLength; label: string; pages: string; extra: string }[] = [
    { id: 'short', label: 'קצר', pages: '8–12 עמ׳', extra: '' },
    { id: 'medium', label: 'בינוני', pages: '16–20 עמ׳', extra: '+₪40' },
    { id: 'long', label: 'ארוך', pages: '24–32 עמ׳', extra: '+₪70' },
  ]

  const formats: { id: BookFormat; label: string; desc: string }[] = [
    { id: 'square', label: 'ריבוע', desc: '20×20 ס"מ' },
    { id: 'portrait', label: 'לאורך', desc: 'A4' },
  ]

  const isValid = params.emotionalDirection && params.ageGroup && params.length && params.format

  return (
    <div className="flex flex-col min-h-dvh">
      <div className="flex items-center justify-between px-4 pt-8 pb-4">
        <button onClick={prevStep} className="text-gray-400 text-sm">← חזרה</button>
        <StepProgress currentStep={2} totalSteps={5} />
        <div className="w-10" />
      </div>

      <div className="px-4 pb-4">
        <h2 className="text-xl font-bold text-gray-800">הגדרות הספר</h2>
      </div>

      <div className="flex flex-col gap-5 px-4 pb-24">
        {/* Emotional Direction */}
        <div>
          <p className="font-semibold text-gray-700 mb-2">הכיוון הרגשי</p>
          <div className="grid grid-cols-2 gap-2">
            {directions.map((d) => (
              <button
                key={d.id}
                onClick={() => setDirection(d.id)}
                className={cn(
                  'py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all text-right',
                  params.emotionalDirection === d.id
                    ? 'border-coral-500 bg-coral-50 text-coral-700'
                    : 'border-gray-100 bg-white text-gray-600 hover:border-coral-200'
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age Group */}
        <div>
          <p className="font-semibold text-gray-700 mb-2">גיל היעד</p>
          <div className="grid grid-cols-4 gap-2">
            {ageGroups.map((a) => (
              <button
                key={a.id}
                onClick={() => setAgeGroup(a.id)}
                className={cn(
                  'py-2 px-1 rounded-xl text-xs font-medium border-2 transition-all text-center',
                  params.ageGroup === a.id
                    ? 'border-coral-500 bg-coral-50 text-coral-700'
                    : 'border-gray-100 bg-white text-gray-600'
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Book Length */}
        <div>
          <p className="font-semibold text-gray-700 mb-2">אורך הספר</p>
          <div className="grid grid-cols-3 gap-2">
            {lengths.map((l) => (
              <button
                key={l.id}
                onClick={() => setLength(l.id)}
                className={cn(
                  'py-3 px-2 rounded-xl text-center border-2 transition-all',
                  params.length === l.id
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-gray-100 bg-white'
                )}
              >
                <p className={cn('font-bold text-sm', params.length === l.id ? 'text-coral-700' : 'text-gray-700')}>
                  {l.label}
                </p>
                <p className="text-xs text-gray-400">{l.pages}</p>
                {l.extra && <p className="text-xs text-coral-500 font-semibold">{l.extra}</p>}
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div>
          <p className="font-semibold text-gray-700 mb-2">פורמט הספר</p>
          <div className="grid grid-cols-2 gap-2">
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={cn(
                  'py-3 px-3 rounded-xl text-center border-2 transition-all flex flex-col items-center gap-1',
                  params.format === f.id
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-gray-100 bg-white'
                )}
              >
                <span className="text-2xl">{f.id === 'square' ? '⬛' : '📄'}</span>
                <p className={cn('font-semibold text-sm', params.format === f.id ? 'text-coral-700' : 'text-gray-700')}>
                  {f.label}
                </p>
                <p className="text-xs text-gray-400">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Next Button */}
      <div className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FFF9F0] to-transparent">
        <Button size="lg" onClick={nextStep} disabled={!isValid}>
          המשך ›
        </Button>
      </div>
    </div>
  )
}
