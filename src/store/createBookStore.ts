import { create } from 'zustand'
import { BookParams, Character, BookTemplate, EmotionalDirection, AgeGroup, BookLength, BookFormat } from '@/types'

interface CreateBookState {
  step: number
  params: Partial<BookParams>
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setTemplate: (template: BookTemplate) => void
  setDirection: (direction: EmotionalDirection) => void
  setAgeGroup: (age: AgeGroup) => void
  setLength: (length: BookLength) => void
  setFormat: (format: BookFormat) => void
  setCharacters: (characters: Character[]) => void
  setPersonalization: (data: Partial<BookParams>) => void
  reset: () => void
}

export const useCreateBookStore = create<CreateBookState>((set) => ({
  step: 1,
  params: {
    visualStyle: 'realistic',
    includeNikud: false,
    languageLevel: 'kindergarten',
    characters: [],
  },

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),

  setTemplate: (template) =>
    set((s) => ({ params: { ...s.params, template } })),

  setDirection: (emotionalDirection) =>
    set((s) => ({ params: { ...s.params, emotionalDirection } })),

  setAgeGroup: (ageGroup) =>
    set((s) => ({ params: { ...s.params, ageGroup } })),

  setLength: (length) =>
    set((s) => ({ params: { ...s.params, length } })),

  setFormat: (format) =>
    set((s) => ({ params: { ...s.params, format } })),

  setCharacters: (characters) =>
    set((s) => ({ params: { ...s.params, characters } })),

  setPersonalization: (data) =>
    set((s) => ({ params: { ...s.params, ...data } })),

  reset: () =>
    set({
      step: 1,
      params: {
        visualStyle: 'realistic',
        includeNikud: false,
        languageLevel: 'kindergarten',
        characters: [],
      },
    }),
}))
