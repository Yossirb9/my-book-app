import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  AgeGroup,
  BookFormat,
  BookLength,
  BookParams,
  BookTemplate,
  Character,
  EmotionalDirection,
} from '@/types'

interface CreateBookState {
  step: number
  params: Partial<BookParams>
  showAuthGate: boolean
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setShowAuthGate: (show: boolean) => void
  setTemplate: (template: BookTemplate) => void
  setDirection: (direction: EmotionalDirection) => void
  setAgeGroup: (age: AgeGroup) => void
  setLength: (length: BookLength) => void
  setFormat: (format: BookFormat) => void
  setCharacters: (characters: Character[]) => void
  setPersonalization: (data: Partial<BookParams>) => void
  reset: () => void
}

const initialParams: Partial<BookParams> = {
  visualStyle: 'realistic',
  includeNikud: false,
  languageLevel: 'kindergarten',
  length: 'long',
  characters: [],
}

export const useCreateBookStore = create<CreateBookState>()(
  persist(
    (set) => ({
      step: 1,
      params: initialParams,
      showAuthGate: false,

      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
      setShowAuthGate: (showAuthGate) => set({ showAuthGate }),

      setTemplate: (template) =>
        set((state) => ({ params: { ...state.params, template } })),

      setDirection: (emotionalDirection) =>
        set((state) => ({ params: { ...state.params, emotionalDirection } })),

      setAgeGroup: (ageGroup) =>
        set((state) => ({ params: { ...state.params, ageGroup } })),

      setLength: (length) =>
        set((state) => ({ params: { ...state.params, length } })),

      setFormat: (format) =>
        set((state) => ({ params: { ...state.params, format } })),

      setCharacters: (characters) =>
        set((state) => ({ params: { ...state.params, characters } })),

      setPersonalization: (data) =>
        set((state) => ({ params: { ...state.params, ...data } })),

      reset: () =>
        set({
          step: 1,
          params: initialParams,
          showAuthGate: false,
        }),
    }),
    {
      name: 'create-book-flow',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        step: state.step,
        params: state.params,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.showAuthGate = false
        }
      },
    }
  )
)
