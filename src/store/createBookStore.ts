import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  AgeGroup,
  BookFormat,
  BookLength,
  BookParams,
  BookTemplate,
  Character,
  DeliveryOption,
  EmotionalDirection,
  OrderDraftInput,
  ShippingAddressDraft,
} from '@/types'

type OrderDraftPatch = Partial<Omit<OrderDraftInput, 'shippingAddress'>> & {
  shippingAddress?: Partial<ShippingAddressDraft>
}

interface CreateBookState {
  step: number
  params: Partial<BookParams>
  orderDraft: OrderDraftInput
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
  setDeliveryOption: (deliveryOption: DeliveryOption) => void
  setOrderDraft: (data: OrderDraftPatch) => void
  reset: () => void
}

const initialParams: Partial<BookParams> = {
  visualStyle: 'realistic',
  includeNikud: false,
  languageLevel: 'kindergarten',
  length: 'long',
  characters: [],
}

const initialOrderDraft: OrderDraftInput = {
  deliveryOption: 'digital',
  promotionCode: '',
  shippingAddress: {
    recipientName: '',
    phone: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'IL',
  },
}

export const useCreateBookStore = create<CreateBookState>()(
  persist(
    (set) => ({
      step: 1,
      params: initialParams,
      orderDraft: initialOrderDraft,
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

      setDeliveryOption: (deliveryOption) =>
        set((state) => ({
          orderDraft: {
            ...state.orderDraft,
            deliveryOption,
          },
        })),

      setOrderDraft: (data) =>
        set((state) => ({
          orderDraft: {
            ...state.orderDraft,
            ...data,
            shippingAddress: {
              ...initialOrderDraft.shippingAddress,
              ...state.orderDraft.shippingAddress,
              ...(data.shippingAddress || {}),
            } as ShippingAddressDraft,
          },
        })),

      reset: () =>
        set({
          step: 1,
          params: initialParams,
          orderDraft: initialOrderDraft,
          showAuthGate: false,
        }),
    }),
    {
      name: 'create-book-flow',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        step: state.step,
        params: state.params,
        orderDraft: state.orderDraft,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.showAuthGate = false
        }
      },
    }
  )
)
