'use client'
import { useCreateBookStore } from '@/store/createBookStore'
import Button from '@/components/ui/Button'
import { StepProgress } from '@/components/ui/StepProgress'
import { Character } from '@/types'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export default function StepCharacters() {
  const { nextStep, prevStep, params, setCharacters } = useCreateBookStore()
  const characters: Character[] = params.characters || []
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const addCharacter = () => {
    if (characters.length >= 3) return
    const newChar: Character = {
      id: crypto.randomUUID(),
      name: '',
      role: characters.length === 0 ? 'main' : 'secondary',
    }
    setCharacters([...characters, newChar])
  }

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(characters.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const removeCharacter = (id: string) => {
    setCharacters(characters.filter((c) => c.id !== id))
  }

  const handleImageUpload = (id: string, file: File) => {
    // Use FileReader to get base64 data URL — blob URLs only work in the browser
    // but base64 data URLs persist and can be sent to the server for Supabase upload
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      updateCharacter(id, { imageUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  const isValid = characters.length > 0 && characters.every((c) => c.name.trim() && c.imageUrl)

  return (
    <div className="flex flex-col min-h-dvh">
      <div className="flex items-center justify-between px-4 pt-8 pb-4">
        <button onClick={prevStep} className="text-gray-400 text-sm">← חזרה</button>
        <StepProgress currentStep={3} totalSteps={5} />
        <div className="w-10" />
      </div>

      <div className="px-4 pb-2">
        <h2 className="text-xl font-bold text-gray-800">העלו תמונות של הדמויות</h2>
        <p className="text-sm text-gray-500 mt-1">הדמויות בספר יידמו לאנשים האמיתיים 🎨</p>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 mt-2">
        {characters.map((char, idx) => (
          <div key={char.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex gap-3 items-start">
              {/* Avatar Upload */}
              <button
                onClick={() => fileInputRefs.current[idx]?.click()}
                className={cn(
                  'w-20 h-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center shrink-0 overflow-hidden transition-all',
                  char.imageUrl ? 'border-coral-500' : 'border-gray-200 hover:border-coral-300'
                )}
              >
                {char.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <span className="text-xl">📷</span>
                    <span className="text-xs text-gray-400 mt-0.5">העלה</span>
                  </>
                )}
              </button>
              <input
                ref={(el) => { fileInputRefs.current[idx] = el }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(char.id, e.target.files[0])}
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    char.role === 'main' ? 'bg-coral-100 text-coral-600' : 'bg-gray-100 text-gray-500'
                  )}>
                    {char.role === 'main' ? 'דמות ראשית' : 'דמות משנית'}
                  </span>
                  <button onClick={() => removeCharacter(char.id)} className="text-gray-300 hover:text-red-400 text-sm">
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="שם הדמות"
                  value={char.name}
                  onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-coral-400 text-right"
                />
                <input
                  type="text"
                  placeholder="תיאור קצר (אופציונלי)"
                  value={char.description || ''}
                  onChange={(e) => updateCharacter(char.id, { description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-2 focus:outline-none focus:border-coral-400 text-right"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Character */}
        {characters.length < 3 && (
          <button
            onClick={addCharacter}
            className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-4 flex items-center justify-center gap-2 text-gray-400 hover:border-coral-300 hover:text-coral-400 transition-all"
          >
            <span className="text-xl">+</span>
            <span className="font-medium">הוסיפו דמות {characters.length === 0 ? 'ראשונה' : characters.length === 1 ? 'שנייה' : 'שלישית'}</span>
          </button>
        )}

        {/* Tip */}
        <div className="bg-peach-300/30 rounded-xl p-3 flex gap-2">
          <span>💡</span>
          <p className="text-sm text-gray-600">תמונה ברורה של הפנים תשפר מאוד את הדמיון לדמות</p>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FFF9F0] to-transparent">
        <Button size="lg" onClick={nextStep} disabled={!isValid}>
          המשך ›
        </Button>
      </div>
    </div>
  )
}
