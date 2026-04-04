'use client'

import { useMemo, useRef } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import CreateShell from '@/components/create/CreateShell'
import { cn } from '@/lib/utils'
import { useCreateBookStore } from '@/store/createBookStore'
import { Character } from '@/types'

const EMPTY_CHARACTERS: Character[] = []

function normalizeRoles(characters: Character[]) {
  return characters.map((character, index) => ({
    ...character,
    role: (index === 0 ? 'main' : 'secondary') as Character['role'],
  }))
}

const photoGuidelines = [
  'תמונה אחת טובה לכל דמות מספיקה בשלב הזה.',
  'עדיף פנים גלויות, תאורה נעימה ומבט ישיר או חצי-צד.',
  'רקע נקי יעזור לשמור על דמיון חזק יותר באיורים.',
]

export default function StepCharacters() {
  const { nextStep, params, prevStep, setCharacters } = useCreateBookStore()
  const characters = params.characters ?? EMPTY_CHARACTERS
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const isValid = characters.length > 0 && characters.every((character) => character.name.trim() && character.imageUrl)
  const completionText = useMemo(() => {
    if (!characters.length) {
      return 'עדיין לא הוספתם דמויות. התחילו בדמות הראשית של הספר.'
    }

    const complete = characters.filter((character) => character.name.trim() && character.imageUrl).length
    return `${complete} מתוך ${characters.length} דמויות מוכנות ליצירה`
  }, [characters])

  const addCharacter = () => {
    if (characters.length >= 5) return

    setCharacters(
      normalizeRoles([
        ...characters,
        {
          id: crypto.randomUUID(),
          name: '',
          role: 'secondary',
        },
      ])
    )
  }

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(
      normalizeRoles(characters.map((character) => (character.id === id ? { ...character, ...updates } : character)))
    )
  }

  const removeCharacter = (id: string) => {
    setCharacters(normalizeRoles(characters.filter((character) => character.id !== id)))
  }

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      updateCharacter(id, { imageUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  return (
    <CreateShell
      step={3}
      onBack={prevStep}
      badge="ליהוק המשפחה"
      footer={
        <div className="lg:min-w-[18rem]">
          <Button size="lg" onClick={nextStep} disabled={!isValid} className="w-full lg:min-w-[18rem]">
            המשיכו להתאמה האישית
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          <div className="rounded-[2rem] border border-black/5 bg-white px-5 py-5 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-black text-[#161625]">מי מופיע בספר?</p>
                <p className="mt-1 text-sm leading-7 text-gray-500">
                  לכל דמות מוסיפים שם, תיאור קצר אופציונלי ותמונה אחת ברורה שתשמש בסיס לאיור.
                </p>
              </div>
              <Badge variant={isValid ? 'ready' : 'default'}>{completionText}</Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {characters.map((character, index) => {
              const missing: string[] = []
              if (!character.name.trim()) missing.push('שם')
              if (!character.imageUrl) missing.push('תמונה')

              return (
                <article
                  key={character.id}
                  className="rounded-[2.1rem] border border-black/5 bg-white p-5 shadow-sm transition-all hover:shadow-[0_20px_40px_rgba(23,25,37,0.08)]"
                >
                  <div className="grid gap-5 xl:grid-cols-[180px_minmax(0,1fr)]">
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[index]?.click()}
                        className={cn(
                          'flex h-44 w-full items-center justify-center overflow-hidden rounded-[1.8rem] border-2 border-dashed transition-all',
                          character.imageUrl ? 'border-coral-300 bg-coral-50' : 'border-gray-200 bg-[#FFF9F0] hover:border-coral-200'
                        )}
                      >
                        {character.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={character.imageUrl} alt={character.name || 'דמות'} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-gray-500">העלאת תמונה</span>
                        )}
                      </button>

                      <input
                        ref={(element) => {
                          fileInputRefs.current[index] = element
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          if (event.target.files?.[0]) {
                            handleImageUpload(character.id, event.target.files[0])
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[index]?.click()}
                        className="w-full rounded-full border border-coral-200 px-4 py-2 text-sm font-semibold text-coral-700 transition-colors hover:bg-coral-50"
                      >
                        {character.imageUrl ? 'החלפת תמונה' : 'בחירת תמונה'}
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={missing.length ? 'default' : 'ready'}>
                            {missing.length ? `חסר: ${missing.join(', ')}` : 'מוכן ליצירה'}
                          </Badge>
                          <span className="rounded-full bg-[#FFF3E7] px-3 py-1 text-xs font-semibold text-coral-700">
                            {character.role === 'main' ? 'דמות ראשית' : 'דמות נוספת'}
                          </span>
                        </div>
                        <button type="button" onClick={() => removeCharacter(character.id)} className="text-sm text-gray-400 transition-colors hover:text-red-500">
                          הסרה
                        </button>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-sm font-semibold text-gray-700">שם הדמות</span>
                          <input
                            type="text"
                            placeholder="למשל: נועה, אבא, סבתא רחל"
                            value={character.name}
                            onChange={(event) => updateCharacter(character.id, { name: event.target.value })}
                            className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-coral-500 focus:ring-2 focus:ring-coral-100"
                          />
                        </label>

                        <label className="flex flex-col gap-1.5">
                          <span className="text-sm font-semibold text-gray-700">תיאור קצר אופציונלי</span>
                          <input
                            type="text"
                            placeholder="גיל, קשר משפחתי, תחביב או פרט מזהה"
                            value={character.description || ''}
                            onChange={(event) => updateCharacter(character.id, { description: event.target.value })}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-coral-400"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {characters.length < 5 ? (
            <button
              type="button"
              onClick={addCharacter}
              className="flex w-full items-center justify-center rounded-[2rem] border-2 border-dashed border-coral-200 bg-[linear-gradient(180deg,rgba(255,243,231,0.9)_0%,rgba(255,249,240,0.98)_100%)] px-5 py-5 text-sm font-semibold text-coral-700 transition-all hover:border-coral-300 hover:bg-coral-50"
            >
              הוסיפו דמות {characters.length === 0 ? 'ראשונה' : 'נוספת'}
            </button>
          ) : null}
        </section>

        <aside className="space-y-4">
          <section className="rounded-[2rem] border border-black/5 bg-[#171925] p-6 text-white shadow-[0_20px_40px_rgba(23,25,37,0.18)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coral-300">Guidance</p>
            <h3 className="mt-3 text-2xl font-black">איך לבחור תמונה טובה?</h3>
            <div className="mt-5 space-y-3">
              {photoGuidelines.map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-coral-200">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-white/75">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#161625]">מה יופיע כאן בסוף?</h3>
            <p className="mt-2 text-sm leading-7 text-gray-500">
              אנחנו שומרים כרגע תמונה אחת לכל דמות כדי לשמור על תהליך פשוט, מהיר וברור. בהמשך, בשלב האישור, תראו סיכום מלא של כל הליהוק שבחרתם.
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[1.4rem] bg-[#FFF9F0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">מקסימום דמויות</p>
                <p className="mt-1 text-lg font-black text-[#161625]">עד 5 דמויות בספר</p>
              </div>
              <div className="rounded-[1.4rem] bg-[#FFF9F0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">לכל דמות</p>
                <p className="mt-1 text-lg font-black text-[#161625]">שם + תמונה + תיאור קצר</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </CreateShell>
  )
}
