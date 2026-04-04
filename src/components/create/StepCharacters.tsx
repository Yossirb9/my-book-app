'use client'

import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { StepProgress } from '@/components/ui/StepProgress'
import { cn } from '@/lib/utils'
import { useCreateBookStore } from '@/store/createBookStore'
import { Character } from '@/types'
import { useMemo, useRef } from 'react'

const EMPTY_CHARACTERS: Character[] = []

function normalizeRoles(characters: Character[]) {
  return characters.map((character, index) => ({
    ...character,
    role: (index === 0 ? 'main' : 'secondary') as Character['role'],
  }))
}

export default function StepCharacters() {
  const { nextStep, params, prevStep, setCharacters } = useCreateBookStore()
  const characters = params.characters ?? EMPTY_CHARACTERS
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const isValid = characters.length > 0 && characters.every((character) => character.name.trim() && character.imageUrl)
  const completionText = useMemo(() => {
    if (!characters.length) {
      return 'עדיין לא נוספו דמויות.'
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
    <div className="flex min-h-dvh flex-col">
      <div className="flex items-start justify-between gap-4 px-4 pt-7 pb-5 md:px-6">
        <button type="button" onClick={prevStep} className="pt-1 text-sm font-medium text-gray-500 hover:text-gray-800">
          חזרה
        </button>
        <StepProgress currentStep={3} />
        <div className="w-12" />
      </div>

      <div className="px-4 pb-5 md:px-6">
        <Badge variant="default" className="mb-3">
          מספיקה תמונה ברורה אחת לכל דמות
        </Badge>
        <h1 className="text-2xl font-black text-gray-900 md:text-3xl">מי מופיע בספר?</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600 md:text-base">
          לכל דמות נוסיף שם, תפקיד ותמונה אחת טובה. התמונה הזו היא הבסיס לאיור האישי של הספר.
        </p>
        <p className="mt-3 text-sm font-semibold text-coral-700">{completionText}</p>
      </div>

      <div className="space-y-3 px-4 pb-28 md:px-6">
        {characters.map((character, index) => {
          const missing: string[] = []
          if (!character.name.trim()) missing.push('שם')
          if (!character.imageUrl) missing.push('תמונה')

          return (
            <div key={character.id} className="rounded-[2rem] border border-white bg-white p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[index]?.click()}
                  className={cn(
                    'flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border-2 border-dashed transition-all',
                    character.imageUrl ? 'border-coral-500 bg-coral-50' : 'border-gray-200 bg-[#FFF9F0]'
                  )}
                >
                  {character.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={character.imageUrl} alt={character.name || 'דמות'} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-gray-500">העלאת תמונה</span>
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

                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={missing.length ? 'default' : 'ready'}>
                        {missing.length ? `חסר: ${missing.join(', ')}` : 'מוכן ליצירה'}
                      </Badge>
                      <span className="text-xs font-semibold text-gray-500">
                        {character.role === 'main' ? 'דמות ראשית' : 'דמות נוספת'}
                      </span>
                    </div>
                    <button type="button" onClick={() => removeCharacter(character.id)} className="text-sm text-gray-400 hover:text-red-500">
                      הסרה
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="שם הדמות"
                    value={character.name}
                    onChange={(event) => updateCharacter(character.id, { name: event.target.value })}
                    className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-coral-500 focus:ring-2 focus:ring-coral-100"
                  />
                  <input
                    type="text"
                    placeholder="תיאור קצר אופציונלי: גיל, קשר משפחתי, תחביב או פרט מזהה"
                    value={character.description || ''}
                    onChange={(event) => updateCharacter(character.id, { description: event.target.value })}
                    className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-coral-400"
                  />
                </div>
              </div>
            </div>
          )
        })}

        {characters.length < 5 && (
          <button
            type="button"
            onClick={addCharacter}
            className="flex w-full items-center justify-center rounded-[2rem] border-2 border-dashed border-coral-200 bg-coral-50/70 px-4 py-4 text-sm font-semibold text-coral-700 transition-colors hover:bg-coral-50"
          >
            הוסיפו דמות {characters.length === 0 ? 'ראשונה' : 'נוספת'}
          </button>
        )}

        <div className="rounded-[2rem] bg-white/80 p-4 text-sm leading-6 text-gray-600 shadow-sm ring-1 ring-white">
          תמונה אחת טובה עדיפה על כמה תמונות לא ברורות. עדיף פנים גלויות, תאורה נעימה ורקע כמה שיותר נקי.
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[640px] bg-gradient-to-t from-[#FFF9F0] via-[#FFF9F0] px-4 pt-4 pb-6 md:px-6">
        <Button size="lg" onClick={nextStep} disabled={!isValid}>
          המשיכו להתאמה אישית
        </Button>
      </div>
    </div>
  )
}
