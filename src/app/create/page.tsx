'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCreateBookStore } from '@/store/createBookStore'
import StepBookType from '@/components/create/StepBookType'
import StepCharacters from '@/components/create/StepCharacters'
import StepDetails from '@/components/create/StepDetails'
import StepPayment from '@/components/create/StepPayment'
import { BOOK_CATEGORIES } from '@/lib/bookTemplates'

const STEPS = [StepBookType, StepCharacters, StepDetails, StepPayment]
const VALID_TEMPLATES = new Set(BOOK_CATEGORIES.flatMap((category) => category.templates.map((template) => template.id)))

export default function CreatePage() {
  const searchParams = useSearchParams()
  const step = useCreateBookStore((state) => state.step)
  const setTemplate = useCreateBookStore((state) => state.setTemplate)
  const setStep = useCreateBookStore((state) => state.setStep)
  const StepComponent = STEPS[step - 1]

  useEffect(() => {
    const template = searchParams.get('template')
    if (!template || !VALID_TEMPLATES.has(template as never)) return

    setTemplate(template as Parameters<typeof setTemplate>[0])
    setStep(2)
  }, [searchParams, setStep, setTemplate])

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top_right,rgba(232,124,83,0.16),transparent_22%),linear-gradient(180deg,#0f1018_0%,#171925_48%,#11111a_100%)]">
      <StepComponent />
    </main>
  )
}
